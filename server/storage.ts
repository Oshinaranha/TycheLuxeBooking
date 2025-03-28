import { 
  users, type User, type InsertUser,
  services, type Service, type InsertService,
  destinations, type Destination, type InsertDestination,
  bookings, type Booking, type InsertBooking,
  contacts, type Contact, type InsertContact
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllServices(): Promise<Service[]>;
  getServicesByType(type: string): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  
  getAllDestinations(): Promise<Destination[]>;
  getDestination(id: number): Promise<Destination | undefined>;
  createDestination(destination: InsertDestination): Promise<Destination>;
  
  createBooking(booking: InsertBooking): Promise<Booking>;
  getAllBookings(): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  
  createContact(contact: InsertContact): Promise<Contact>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private services: Map<number, Service>;
  private destinations: Map<number, Destination>;
  private bookings: Map<number, Booking>;
  private contacts: Map<number, Contact>;
  
  private currentUserId: number;
  private currentServiceId: number;
  private currentDestinationId: number;
  private currentBookingId: number;
  private currentContactId: number;

  constructor() {
    this.users = new Map();
    this.services = new Map();
    this.destinations = new Map();
    this.bookings = new Map();
    this.contacts = new Map();
    
    this.currentUserId = 1;
    this.currentServiceId = 1;
    this.currentDestinationId = 1;
    this.currentBookingId = 1;
    this.currentContactId = 1;
    
    this.initializeServices();
    this.initializeDestinations();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getAllServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }
  
  async getServicesByType(type: string): Promise<Service[]> {
    return Array.from(this.services.values()).filter(
      (service) => service.type === type
    );
  }
  
  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }
  
  async createService(insertService: InsertService): Promise<Service> {
    const id = this.currentServiceId++;
    const service: Service = { ...insertService, id };
    this.services.set(id, service);
    return service;
  }
  
  async getAllDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values());
  }
  
  async getDestination(id: number): Promise<Destination | undefined> {
    return this.destinations.get(id);
  }
  
  async createDestination(insertDestination: InsertDestination): Promise<Destination> {
    const id = this.currentDestinationId++;
    const destination: Destination = { ...insertDestination, id };
    this.destinations.set(id, destination);
    return destination;
  }
  
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const booking: Booking = { 
      ...insertBooking, 
      id,
      createdAt: new Date()
    };
    this.bookings.set(id, booking);
    return booking;
  }
  
  async getAllBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }
  
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }
  
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const contact: Contact = { 
      ...insertContact, 
      id,
      createdAt: new Date()
    };
    this.contacts.set(id, contact);
    return contact;
  }
  
  private initializeServices(): void {
    // Jets
    this.createService({
      type: 'jet',
      name: 'Gulfstream G650',
      description: 'Experience the pinnacle of air travel with our fleet of luxurious private jets. Travel on your schedule with unmatched comfort and privacy.',
      imageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8bHV4dXJ5LXByaXZhdGUtamV0c3x8fHx8fDE3MTY1MDU5ODg&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
      pricePerHour: 5000,
      capacity: 14,
      features: ['Global range', 'Luxury cabin', 'Dedicated crew', 'Gourmet catering', 'Wi-Fi connectivity']
    });
    
    this.createService({
      type: 'jet',
      name: 'Bombardier Global 7500',
      description: 'The industry\'s largest and longest-range business jet, featuring the widest cabin and smoothest ride.',
      imageUrl: 'https://images.unsplash.com/photo-1587162146766-e06b1189b907?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8bHV4dXJ5LXByaXZhdGUtamV0c3x8fHx8fDE3MTY1MDg5ODQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
      pricePerHour: 6500,
      capacity: 17,
      features: ['Ultra-long range', 'Four living spaces', 'Master suite', 'Full kitchen', 'Advanced air purification']
    });
    
    this.createService({
      type: 'jet',
      name: 'Cessna Citation X',
      description: 'The fastest civilian aircraft available for charter, perfect for those with tight schedules.',
      imageUrl: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8bHV4dXJ5LXByaXZhdGUtamV0c3x8fHx8fDE3MTY1MDkwMDk&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
      pricePerHour: 3500,
      capacity: 8,
      features: ['Fastest private jet', 'Transcontinental range', 'Executive interior', 'Entertainment system', 'Satellite phone']
    });
    
    // Yachts
    this.createService({
      type: 'yacht',
      name: 'Oceanco Nirvana',
      description: 'Navigate crystal-clear waters in style with our exquisite yacht collection. Enjoy personalized service and breathtaking views.',
      imageUrl: 'https://images.unsplash.com/photo-1560507074-b9eb43faab00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8bHV4dXJ5LXlhY2h0c3x8fHx8fDE3MTY1MjgxNDA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
      pricePerDay: 15000,
      capacity: 12,
      features: ['Full crew included', 'Master suite', 'Jacuzzi', 'Gym', 'Water toys', 'Tender garage']
    });
    
    this.createService({
      type: 'yacht',
      name: 'Feadship Madame Gu',
      description: 'An exceptional superyacht offering unprecedented levels of luxury and cutting-edge technology.',
      imageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8bHV4dXJ5LXlhY2h0c3x8fHx8fDE3MTY1MDU3MjQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
      pricePerDay: 18000,
      capacity: 10,
      features: ['Award-winning design', 'Helipad', 'Beach club', 'Cinema room', 'Spa', 'World-class chef']
    });
    
    this.createService({
      type: 'yacht',
      name: 'Benetti Diamonds Are Forever',
      description: 'A magnificent vessel combining Italian craftsmanship with opulent amenities for an unforgettable voyage.',
      imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8bHV4dXJ5LXlhY2h0c3x8fHx8fDE3MTY1MDY1MDU&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
      pricePerDay: 14000,
      capacity: 12,
      features: ['Panoramic sky lounge', 'Glass elevator', 'Multiple decks', 'Al fresco dining', 'Stabilizers', 'Snorkeling gear']
    });
    
    // Cars
    this.createService({
      type: 'car',
      name: 'Lamborghini Aventador',
      description: 'Drive the world\'s most prestigious automobiles. Our collection features the latest models from Lamborghini, Ferrari, Bentley, and more.',
      imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8bHV4dXJ5LWNhcnN8fHx8fHwxNzE2NTI4MTg0&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
      pricePerDay: 1200,
      features: ['V12 engine', 'Unlimited mileage', 'Driver optional', 'Insurance included', 'Concierge delivery']
    });
    
    this.createService({
      type: 'car',
      name: 'Rolls-Royce Phantom',
      description: 'The epitome of automotive luxury, offering an unparalleled combination of presence and comfort.',
      imageUrl: 'https://images.unsplash.com/photo-1549440869-bc0c39c4105b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8bHV4dXJ5LWNhcnN8fHx8fHwxNzE2NTA5MjE1&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
      pricePerDay: 1400,
      features: ['Chauffeur service', '6.75L V12 engine', 'Starlight headliner', 'Bespoke interior', 'Champagne cooler']
    });
    
    this.createService({
      type: 'car',
      name: 'Ferrari 488 Spider',
      description: 'Experience the thrill of open-air motoring in one of the most exhilarating convertible supercars ever made.',
      imageUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8bHV4dXJ5LWNhcnN8fHx8fHwxNzE2NTA2MjAx&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
      pricePerDay: 1300,
      features: ['Retractable hardtop', 'Twin-turbo V8', 'Racing dynamics', 'Carbon fiber interior', 'Track day option']
    });
  }
  
  private initializeDestinations(): void {
    this.createDestination({
      name: 'Saint-Tropez',
      location: 'French Riviera',
      description: 'Explore the luxurious harbors and pristine beaches of the French Riviera\'s most glamorous destination.',
      imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8bHV4dXJ5LXlhY2h0c3x8fHx8fDE3MTY1MDY1MDU&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
      rating: 49,
      region: 'Mediterranean'
    });
    
    this.createDestination({
      name: 'Dubai',
      location: 'United Arab Emirates',
      description: 'Experience the ultimate in urban luxury amid Dubai\'s futuristic skyline and opulent experiences.',
      imageUrl: 'https://images.unsplash.com/photo-1512036666432-2181c1f26420?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8bHV4dXJ5LWxpZmVzdHlsZXx8fHx8fDE3MTY1MDY1MjU&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
      rating: 48,
      region: 'Middle East'
    });
    
    this.createDestination({
      name: 'Aspen',
      location: 'Colorado, USA',
      description: 'Indulge in world-class skiing, fine dining, and exclusive mountain retreats in this elite winter destination.',
      imageUrl: 'https://images.unsplash.com/photo-1578922746465-3a80a228f223?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8bHV4dXJ5LXByaXZhdGUtamV0c3x8fHx8fDE3MTY1MDY1NDI&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
      rating: 49,
      region: 'North America'
    });
    
    this.createDestination({
      name: 'Maldives',
      location: 'Indian Ocean',
      description: 'Discover paradise in these exotic islands with crystal waters, overwater villas, and unparalleled marine life.',
      imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8bHV4dXJ5LWxpZmVzdHlsZXx8fHx8fDE3MTY1MDk0Nzg&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
      rating: 50,
      region: 'Asia Pacific'
    });
    
    this.createDestination({
      name: 'Lake Como',
      location: 'Italy',
      description: 'Experience timeless elegance in this legendary Italian lake district, renowned for its historic villas and scenic beauty.',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8bHV4dXJ5LXlhY2h0c3x8fHx8fDE3MTY1MDYyNTM&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
      rating: 48,
      region: 'Europe'
    });
    
    this.createDestination({
      name: 'Monaco',
      location: 'French Riviera',
      description: 'The playground of the elite, offering exclusive casinos, yacht-filled harbors, and the famous Grand Prix circuit.',
      imageUrl: 'https://images.unsplash.com/photo-1548430395-ec39eaf2aa1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8bHV4dXJ5LXByaXZhdGUtamV0c3x8fHx8fDE3MTY1MDYzMDA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
      rating: 50,
      region: 'Mediterranean'
    });
  }
}

export const storage = new MemStorage();
