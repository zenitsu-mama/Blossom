import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { EventData, RegistrationFormData, RegistrationFormErrors, RegistrationResult, RegistrationState, TeamMember } from '../types';
import { auth } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

const INITIAL_FORM_DATA: RegistrationFormData = {
  fullName: '',
  email: '',
  contactNumber: '',
  organizationInstitute: '',
  teamMembers: [],
  eventSpecificResponses: {},
};

export function useRegistration(eventId: string | undefined) {
  const [event, setEvent] = useState<EventData | null>(null);
  const [loadingEvent, setLoadingEvent] = useState<boolean>(true);
  const [eventError, setEventError] = useState<string | null>(null);

  const [state, setState] = useState<RegistrationState>('IDLE');
  const [formData, setFormData] = useState<RegistrationFormData>(INITIAL_FORM_DATA);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<RegistrationFormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [registrationResult, setRegistrationResult] = useState<RegistrationResult | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // 1. Listen for current auth state and prefill from account profile if available
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setFormData((prev) => ({
          ...prev,
          fullName: prev.fullName || user.displayName || '',
          email: prev.email || user.email || '',
        }));

        try {
          const userEmail = user.email || '';
          const token = await user.getIdToken().catch(() => '');
          const headers: Record<string, string> = { 'x-user-email': userEmail };
          if (token) headers['Authorization'] = `Bearer ${token}`;

          const res = await fetch(`/api/account?email=${encodeURIComponent(userEmail)}`, { headers });
          if (res.ok) {
            const data = await res.json();
            if (data?.user) {
              setFormData((prev) => ({
                ...prev,
                fullName: prev.fullName || data.user.fullName || data.user.name || user.displayName || '',
                email: prev.email || data.user.email || user.email || '',
                contactNumber: prev.contactNumber || data.user.phone || data.user.contactNumber || '',
                organizationInstitute: prev.organizationInstitute || data.user.department || data.user.institute || 'Christ University',
                rollNumber: prev.rollNumber || data.user.rollNumber || data.user.roll_number || '',
              }));
            }
          }
        } catch (e) {
          console.warn('Auto prefill account profile non-fatal error:', e);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch target event data
  useEffect(() => {
    if (!eventId) {
      setLoadingEvent(false);
      setEventError('No event selected.');
      return;
    }

    let isMounted = true;
    setLoadingEvent(true);
    setEventError(null);

    fetch(`/api/events/${eventId}`)
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || 'Event not found');
        }
        return res.json();
      })
      .then((data: EventData) => {
        if (!isMounted) return;
        setEvent(data);
        setState('FORM');

        // If it's a group event, initialize initial team member slots (team size minus 1 for leader)
        if (data.type === 'group' && data.min_team_size && data.min_team_size > 1) {
          const requiredMemberCount = Math.max(1, data.min_team_size - 1);
          setFormData((prev) => {
            if (prev.teamMembers.length === 0) {
              const initialList: TeamMember[] = Array.from({ length: requiredMemberCount }, () => ({
                name: '',
                reg_number: '',
              }));
              return { ...prev, teamMembers: initialList };
            }
            return prev;
          });
        }
        setLoadingEvent(false);
      })
      .catch((err: Error) => {
        if (!isMounted) return;
        setEventError(err.message || 'Failed to load event details.');
        setLoadingEvent(false);
      });

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  // 3. Validation Logic
  const validateField = useCallback(
    (field: keyof RegistrationFormData | string, value: any, currentForm: RegistrationFormData = formData): string | undefined => {
      if (field === 'fullName') {
        const val = (value as string || '').trim();
        if (!val) return 'Full Name is required';
        if (val.length < 2) return 'Full Name must be at least 2 characters';
        return undefined;
      }

      if (field === 'email') {
        const val = (value as string || '').trim();
        if (!val) return 'Email address is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) return 'Please enter a valid email address';
        return undefined;
      }

      if (field === 'contactNumber') {
        const val = (value as string || '').trim();
        if (!val) return 'Contact Number is required';
        const cleanDigits = val.replace(/\D/g, '');
        if (cleanDigits.length < 10) return 'Please enter a valid 10-digit phone number';
        return undefined;
      }

      if (field === 'organizationInstitute') {
        const val = (value as string || '').trim();
        if (!val) return 'Organization / Institute is required';
        return undefined;
      }

      if (field === 'teamMembers' && event?.type === 'group') {
        const members = (value as TeamMember[]) || currentForm.teamMembers;
        const totalTeamSize = members.length + 1; // +1 for team lead
        const minSize = event.min_team_size || 1;
        const maxSize = event.max_team_size || 20;

        if (totalTeamSize < minSize) {
          return `Minimum ${minSize} members required for this group event (including leader)`;
        }
        if (totalTeamSize > maxSize) {
          return `Maximum ${maxSize} members allowed for this group event`;
        }

        // Check if any member row is incomplete
        for (let i = 0; i < members.length; i++) {
          if (!members[i].name.trim() || !members[i].reg_number.trim()) {
            return `Please complete all details for Team Member #${i + 2}`;
          }
        }
        return undefined;
      }

      // Check event-specific dynamic fields if defined
      if (event?.specific_fields && typeof field === 'string') {
        const fieldConfig = event.specific_fields.find((f) => f.id === field);
        if (fieldConfig && fieldConfig.required) {
          if (value === undefined || value === null || (typeof value === 'string' && !value.trim())) {
            return `${fieldConfig.label} is required`;
          }
        }
      }

      return undefined;
    },
    [event, formData]
  );

  const validateAll = useCallback((): boolean => {
    const newErrors: RegistrationFormErrors = {};

    const nameErr = validateField('fullName', formData.fullName);
    if (nameErr) newErrors.fullName = nameErr;

    const emailErr = validateField('email', formData.email);
    if (emailErr) newErrors.email = emailErr;

    const phoneErr = validateField('contactNumber', formData.contactNumber);
    if (phoneErr) newErrors.contactNumber = phoneErr;

    const orgErr = validateField('organizationInstitute', formData.organizationInstitute);
    if (orgErr) newErrors.organizationInstitute = orgErr;

    if (event?.type === 'group') {
      const teamErr = validateField('teamMembers', formData.teamMembers);
      if (teamErr) newErrors.teamMembers = teamErr;
    }

    if (event?.specific_fields) {
      event.specific_fields.forEach((fieldDef) => {
        const val = formData.eventSpecificResponses[fieldDef.id];
        const err = validateField(fieldDef.id, val);
        if (err) newErrors[fieldDef.id] = err;
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, event, validateField]);

  // 4. Form Handlers
  const handleFieldChange = useCallback(
    (field: keyof RegistrationFormData, value: any) => {
      setFormData((prev) => {
        const updated = { ...prev, [field]: value };
        // If the field already has an active error, clear it once it passes validation
        if (errors[field]) {
          const err = validateField(field, value, updated);
          setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: err,
          }));
        }
        return updated;
      });
    },
    [errors, validateField]
  );

  const handleFieldBlur = useCallback(
    (field: string) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const val = (formData as any)[field] ?? formData.eventSpecificResponses[field];
      const err = validateField(field, val);
      setErrors((prev) => ({ ...prev, [field]: err }));
    },
    [formData, validateField]
  );

  const handleTeamMemberChange = useCallback(
    (index: number, key: 'name' | 'reg_number', value: string) => {
      setFormData((prev) => {
        const updatedMembers = [...prev.teamMembers];
        updatedMembers[index] = { ...updatedMembers[index], [key]: value };
        const updated = { ...prev, teamMembers: updatedMembers };

        if (errors.teamMembers) {
          const err = validateField('teamMembers', updatedMembers, updated);
          setErrors((prevErr) => ({ ...prevErr, teamMembers: err }));
        }
        return updated;
      });
    },
    [errors.teamMembers, validateField]
  );

  const addTeamMember = useCallback(() => {
    if (!event) return;
    const maxSize = event.max_team_size || 20;
    if (formData.teamMembers.length + 1 >= maxSize) return;

    setFormData((prev) => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { name: '', reg_number: '' }],
    }));
  }, [event, formData.teamMembers.length]);

  const removeTeamMember = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index),
    }));
  }, []);

  const handleEventSpecificChange = useCallback(
    (fieldId: string, value: any) => {
      setFormData((prev) => {
        const updatedResponses = { ...prev.eventSpecificResponses, [fieldId]: value };
        const updated = { ...prev, eventSpecificResponses: updatedResponses };
        if (errors[fieldId]) {
          const err = validateField(fieldId, value, updated);
          setErrors((prevErr) => ({ ...prevErr, [fieldId]: err }));
        }
        return updated;
      });
    },
    [errors, validateField]
  );

  // 5. Submission Execution
  const submitRegistration = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();

      // Mark all base fields as touched
      setTouched({
        fullName: true,
        email: true,
        contactNumber: true,
        organizationInstitute: true,
        teamMembers: true,
      });

      if (!validateAll()) {
        return false;
      }

      if (!event) {
        setServerError('Cannot register without an event selected.');
        setState('ERROR');
        return false;
      }

      setState('SUBMITTING');
      setServerError(null);

      const payload = {
        event_id: event.id,
        full_name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.contactNumber.trim(),
        institute: formData.organizationInstitute.trim(),
        roll_number: formData.rollNumber?.trim() || null,
        team_members: event.type === 'group' ? formData.teamMembers : null,
        event_specific_responses: Object.keys(formData.eventSpecificResponses).length > 0 ? formData.eventSpecificResponses : null,
      };

      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => ({}));

        if (response.status === 201) {
          setRegistrationResult({
            registration_id: data.registration_id || data.reg_id || `REG-${Date.now()}`,
            reg_id: data.registration_id || data.reg_id,
            event_id: event.id,
            event_name: data.event_name || event.name,
            full_name: data.full_name || formData.fullName,
            email: data.email || formData.email,
            status: data.status || 'registered',
            created_at: data.created_at || new Date().toISOString(),
            email_sent: Boolean(data.email_sent),
          });
          setState('SUCCESS');
          return true;
        } else if (response.status === 409) {
          // Duplicate registration
          setState('ALREADY_REGISTERED');
          setServerError(data.message || 'You are already registered for this event.');
          return false;
        } else if (response.status === 400) {
          // Validation error returned from backend
          if (data.fields) {
            setErrors((prev) => ({ ...prev, ...data.fields }));
          }
          setServerError(data.message || 'Please check your inputs and try again.');
          setState('FORM');
          return false;
        } else {
          // Other error
          setServerError(data.message || 'Registration could not be completed at this time. Please try again.');
          setState('ERROR');
          return false;
        }
      } catch (err: any) {
        console.error('Network/Server registration failure:', err);
        setServerError('Network connection issue. Please check your connection and try again.');
        setState('ERROR');
        return false;
      }
    },
    [event, formData, validateAll]
  );

  const retrySubmission = useCallback(() => {
    setState('FORM');
    setServerError(null);
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setTouched({});
    setErrors({});
    setServerError(null);
    setRegistrationResult(null);
    setState('FORM');
  }, []);

  return {
    event,
    loadingEvent,
    eventError,
    state,
    formData,
    touched,
    errors,
    serverError,
    registrationResult,
    currentUser,
    isSubmitting: state === 'SUBMITTING',
    handleFieldChange,
    handleFieldBlur,
    handleTeamMemberChange,
    addTeamMember,
    removeTeamMember,
    handleEventSpecificChange,
    submitRegistration,
    retrySubmission,
    resetForm,
  };
}
