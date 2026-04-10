import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface CustomContact {
  id: string;
  name: string;
  phone: string;
}

interface EmergencyContactsContextType {
  customContacts: CustomContact[];
  addContact: (name: string, phone: string) => void;
  removeContact: (id: string) => void;
}

const EmergencyContactsContext = createContext<EmergencyContactsContextType>({
  customContacts: [],
  addContact: () => {},
  removeContact: () => {},
});

const STORAGE_KEY = "nyaya_emergency_contacts";

export function EmergencyContactsProvider({ children }: { children: React.ReactNode }) {
  const [customContacts, setCustomContacts] = useState<CustomContact[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val) {
        try {
          setCustomContacts(JSON.parse(val));
        } catch {}
      }
    });
  }, []);

  const addContact = useCallback((name: string, phone: string) => {
    const newContact: CustomContact = {
      id: Date.now().toString(),
      name: name.trim(),
      phone: phone.trim(),
    };
    setCustomContacts((prev) => {
      const next = [...prev, newContact];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeContact = useCallback((id: string) => {
    setCustomContacts((prev) => {
      const next = prev.filter((c) => c.id !== id);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <EmergencyContactsContext.Provider value={{ customContacts, addContact, removeContact }}>
      {children}
    </EmergencyContactsContext.Provider>
  );
}

export function useEmergencyContacts() {
  return useContext(EmergencyContactsContext);
}
