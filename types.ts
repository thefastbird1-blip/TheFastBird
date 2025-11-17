
export type Lang = 'en' | 'ar';

export interface LocalizedString {
  en: string;
  ar: string;
}

// Fix: Moved Destination, ServiceType, and CalculatorContent here from constants/content.ts
export interface Destination {
  value: string;
  name: LocalizedString;
}
export interface ServiceType {
  value: string;
  name: LocalizedString;
}

export interface CalculatorContent {
  title: LocalizedString;
  fromLabel: LocalizedString;
  weightLabel: LocalizedString;
  destinationLabel: LocalizedString;
  serviceTypeLabel: LocalizedString;
  calculateButton: LocalizedString;
  resultTitle: LocalizedString;
  currency: LocalizedString;
  error: LocalizedString;
  destinations: Destination[];
  serviceTypes: ServiceType[];
}


export interface Content {
  // Fix: Added CalculatorContent to the possible types to handle the shipping calculator data structure.
  // Fix: Allow arrays of LocalizedString for properties like city lists to resolve type error.
  [key: string]: Content | LocalizedString | CalculatorContent | LocalizedString[];
}

export type StatusUpdate = {
  status: string;
  date: string;
  location: string;
  isCompleted: boolean;
};

export type Order = {
  trackingCode: string;
  statusUpdates: StatusUpdate[];
  firstTrack: boolean;
  adminMessage: string;
};