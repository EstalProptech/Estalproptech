import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Search, 
  Plus, 
  MapPin, 
  Eye, 
  Edit, 
  Trash2,
  TrendingUp,
  TrendingDown,
  Sparkles,
  X,
  SlidersHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { AddPropertyModal } from "./AddPropertyModal";
import { PropertyDetailsModal } from "./PropertyDetailsModal";
import { AnimatedCounter } from "./AnimatedCounter";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { toast } from "sonner@2.0.3";
import { useIsMobile } from "./ui/use-mobile";
import { useSwipeGesture } from "../hooks/useSwipeGesture";

const properties = [
  {
    id: 1,
    name: 'North View Residence',
    location: 'Riyadh – Al Narjis District',
    status: 'available',
    price: '10,500 SAR',
    yearlyPrice: '126,000 SAR',
    type: 'Apartment',
    image: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjA5OTU2NTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    beds: 3,
    baths: 2,
    size: '180 sqm',
    owner: 'Ahmed Al-Rashid',
    description: 'Luxurious apartment with stunning city views, modern amenities, and prime location in the heart of Al Narjis. Features include floor-to-ceiling windows, premium finishes, and access to world-class facilities.',
    amenities: ['Parking', 'Gym', 'Pool', 'Security 24/7', 'Central AC', 'Balcony'],
    maintenanceRequests: 0,
    occupancyRate: '95%',
    roi: '8.2%',
    lastUpdated: 'Oct 18, 2025'
  },
  {
    id: 2,
    name: 'Riverside Tower',
    location: 'Jeddah – King Fahd District',
    status: 'rented',
    price: '12,800 SAR',
    yearlyPrice: '153,600 SAR',
    type: 'Villa',
    image: 'https://images.unsplash.com/photo-1706808849780-7a04fbac83ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc2MDk2OTUyOXww&ixlib=rb-4.1.0&q=80&w=1080',
    beds: 4,
    baths: 3,
    size: '320 sqm',
    owner: 'Sarah Al-Otaibi',
    description: 'Elegant villa with spacious rooms, private garden, and premium location. Perfect for families seeking luxury and comfort in a prestigious neighborhood.',
    amenities: ['Garden', 'Garage', 'Maid Room', 'Storage', 'BBQ Area', 'Smart Home'],
    maintenanceRequests: 1,
    occupancyRate: '100%',
    roi: '9.5%',
    lastUpdated: 'Oct 20, 2025'
  },
  {
    id: 3,
    name: 'Garden View Estates',
    location: 'Riyadh – Al-Olaya',
    status: 'available',
    price: '15,000 SAR',
    yearlyPrice: '180,000 SAR',
    type: 'Villa',
    image: 'https://images.unsplash.com/photo-1689574120966-c7b1e57a8cfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMHByb3BlcnR5fGVufDF8fHx8MTc2MTAyODUxMHww&ixlib=rb-4.1.0&q=80&w=1080',
    beds: 5,
    baths: 4,
    size: '450 sqm',
    owner: 'Mohammed Al-Dosari',
    description: 'Spacious villa in prestigious Al-Olaya district. Features modern architecture, private pool, and landscaped garden. Ideal for executives and diplomats.',
    amenities: ['Private Pool', 'Garden', 'Garage', 'Gym', 'Cinema Room', 'Study'],
    maintenanceRequests: 0,
    occupancyRate: '88%',
    roi: '7.8%',
    lastUpdated: 'Oct 19, 2025'
  },
  {
    id: 4,
    name: 'Downtown Plaza',
    location: 'Riyadh – Al-Malqa',
    status: 'rented',
    price: '8,500 SAR',
    yearlyPrice: '102,000 SAR',
    type: 'Apartment',
    image: 'https://images.unsplash.com/photo-1723271198638-8035292089a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBidWlsZGluZyUyMGZhY2FkZXxlbnwxfHx8fDE3NjEwNzk0NTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    beds: 2,
    baths: 2,
    size: '140 sqm',
    owner: 'Fatima Al-Harbi',
    description: 'Modern apartment in vibrant Al-Malqa district. Walking distance to shopping centers, restaurants, and entertainment. Perfect for young professionals.',
    amenities: ['Parking', 'Gym', 'Pool', 'Concierge', 'Rooftop Terrace'],
    maintenanceRequests: 0,
    occupancyRate: '100%',
    roi: '8.8%',
    lastUpdated: 'Oct 21, 2025'
  },
  {
    id: 5,
    name: 'Parkside Homes',
    location: 'Dammam – Al-Sahafa',
    status: 'maintenance',
    price: '9,200 SAR',
    yearlyPrice: '110,400 SAR',
    type: 'Apartment',
    image: 'https://images.unsplash.com/photo-1621831337128-35676ca30868?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzYwOTg1OTQ3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    beds: 3,
    baths: 2,
    size: '165 sqm',
    owner: 'Khalid Al-Zahrani',
    description: 'Well-maintained apartment near parks and schools. Currently undergoing scheduled maintenance upgrades. Expected to be available soon.',
    amenities: ['Parking', 'Playground', 'Security', 'Storage', 'Balcony'],
    maintenanceRequests: 3,
    occupancyRate: '0%',
    roi: '7.2%',
    lastUpdated: 'Oct 17, 2025'
  },
  {
    id: 6,
    name: 'Urban Lofts',
    location: 'Riyadh – Diplomatic Quarter',
    status: 'available',
    price: '11,000 SAR',
    yearlyPrice: '132,000 SAR',
    type: 'Commercial',
    image: 'https://images.unsplash.com/photo-1678788762802-0c6c6cdd89fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHJlYWwlMjBlc3RhdGV8ZW58MXx8fHwxNzYxMDc5NDUyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    beds: 2,
    baths: 1,
    size: '120 sqm',
    owner: 'Noura Al-Subaie',
    description: 'Contemporary loft in exclusive Diplomatic Quarter. High ceilings, modern design, and proximity to embassies and international organizations.',
    amenities: ['Parking', 'Security 24/7', 'Concierge', 'Business Center', 'Meeting Rooms'],
    maintenanceRequests: 0,
    occupancyRate: '92%',
    roi: '8.5%',
    lastUpdated: 'Oct 20, 2025'
  },
  {
    id: 7,
    name: 'Sunset Heights',
    location: 'Riyadh – Al-Arid',
    status: 'rented',
    price: '13,500 SAR',
    yearlyPrice: '162,000 SAR',
    type: 'Villa',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1080',
    beds: 4,
    baths: 3,
    size: '380 sqm',
    owner: 'Abdullah Al-Ghamdi',
    description: 'Premium villa in Al-Arid with exceptional finishes. Features include smart home technology, private pool, and landscaped gardens.',
    amenities: ['Pool', 'Garden', 'Smart Home', 'Garage', 'Maid Room', 'Security'],
    maintenanceRequests: 0,
    occupancyRate: '100%',
    roi: '9.1%',
    lastUpdated: 'Oct 21, 2025'
  },
  {
    id: 8,
    name: 'City Center Office',
    location: 'Riyadh – King Fahd Road',
    status: 'available',
    price: '18,000 SAR',
    yearlyPrice: '216,000 SAR',
    type: 'Commercial',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1080',
    beds: 0,
    baths: 2,
    size: '250 sqm',
    owner: 'Layla Al-Mutairi',
    description: 'Prime commercial space on King Fahd Road. Ideal for corporate offices, with modern infrastructure and excellent accessibility.',
    amenities: ['Parking', 'Elevators', 'Central AC', 'Reception', 'Conference Rooms', 'Cafeteria'],
    maintenanceRequests: 0,
    occupancyRate: '85%',
    roi: '10.2%',
    lastUpdated: 'Oct 19, 2025'
  },
  {
    id: 9,
    name: 'Green Valley Compound',
    location: 'Jeddah – Al-Rawdah',
    status: 'available',
    price: '7,800 SAR',
    yearlyPrice: '93,600 SAR',
    type: 'Apartment',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1080',
    beds: 2,
    baths: 2,
    size: '135 sqm',
    owner: 'Omar Al-Shehri',
    description: 'Cozy apartment in family-friendly compound. Features include community facilities, gardens, and children\'s play areas.',
    amenities: ['Pool', 'Playground', 'Gym', 'Parking', 'Garden', 'Security'],
    maintenanceRequests: 0,
    occupancyRate: '90%',
    roi: '7.5%',
    lastUpdated: 'Oct 18, 2025'
  }
];

const statusConfig = {
  available: { label: 'Available', color: 'bg-secondary', textColor: 'text-secondary' },
  rented: { label: 'Rented', color: 'bg-accent', textColor: 'text-accent' },
  maintenance: { label: 'Maintenance', color: 'bg-muted-foreground', textColor: 'text-muted-foreground' },
};

export function PropertiesView() {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<typeof properties[0] | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<number | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Filter properties
  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === "all" || property.type.toLowerCase() === typeFilter.toLowerCase();
    const matchesStatus = statusFilter === "all" || property.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case "price-high":
        return parseInt(b.price.replace(/[^0-9]/g, '')) - parseInt(a.price.replace(/[^0-9]/g, ''));
      case "price-low":
        return parseInt(a.price.replace(/[^0-9]/g, '')) - parseInt(b.price.replace(/[^0-9]/g, ''));
      case "roi":
        return parseFloat(b.roi) - parseFloat(a.roi);
      default:
        return b.id - a.id;
    }
  });

  // Stats
  const totalProperties = properties.length;
  const occupiedUnits = properties.filter(p => p.status === 'rented').length;
  const vacantUnits = properties.filter(p => p.status === 'available').length;
  const maintenanceOngoing = properties.filter(p => p.status === 'maintenance').length;

  const handlePropertyClick = (property: typeof properties[0]) => {
    setSelectedProperty(property);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteClick = (propertyId: number) => {
    setPropertyToDelete(propertyId);
  };

  const confirmDelete = () => {
    toast.success("Property Deleted", {
      description: "The property has been removed from your portfolio.",
    });
    setPropertyToDelete(null);
    setIsDetailsModalOpen(false);
  };

  const handleEditClick = () => {
    toast.info("Edit Property", {
      description: "Edit functionality would open here.",
    });
  };

  const updateActiveFilters = () => {
    const filters: string[] = [];
    if (typeFilter !== "all") filters.push(`Type: ${typeFilter}`);
    if (statusFilter !== "all") filters.push(`Status: ${statusFilter}`);
    setActiveFilters(filters);
  };

  const clearFilter = (filter: string) => {
    if (filter.startsWith("Type:")) setTypeFilter("all");
    if (filter.startsWith("Status:")) setStatusFilter("all");
  };

  const clearAllFilters = () => {
    setTypeFilter("all");
    setStatusFilter("all");
    setActiveFilters([]);
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-4">
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl md:text-3xl mb-1 md:mb-2">Properties Overview</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage your listed and rented properties easily</p>
        </div>
        <Button 
          className="rounded-[16px] bg-primary hover:bg-secondary shadow-md hover:shadow-lg transition-all duration-300 self-start touch-manipulation min-h-[44px]"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          {isMobile ? 'Add' : 'Add Property'}
        </Button>
      </motion.div>

      {/* AI Suggestion Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="rounded-[16px] md:rounded-[20px] shadow-sm border-accent/30 bg-gradient-to-r from-accent/5 to-primary/5">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm">
                  <span className="text-accent">AI:</span> {isMobile ? 'Best ROI: Al-Narjis (+9.2%)' : 'Best ROI areas this quarter: Al-Narjis (+9.2%), Al-Arid (+8.8%)'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Overview Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="rounded-[20px] shadow-lg border-border hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-4 md:p-5">
              <p className="text-xs md:text-sm text-muted-foreground mb-1">Total Properties</p>
              <div className="flex items-end justify-between">
                <h3 className="text-2xl md:text-3xl">
                  <AnimatedCounter value={totalProperties} />
                </h3>
                <div className="flex items-center gap-1 text-xs text-secondary">
                  <TrendingUp className="w-3 h-3" />
                  <span>+12%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="rounded-[20px] shadow-lg border-border hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-4 md:p-5">
              <p className="text-xs md:text-sm text-muted-foreground mb-1">Occupied Units</p>
              <div className="flex items-end justify-between">
                <h3 className="text-2xl md:text-3xl text-accent">
                  <AnimatedCounter value={occupiedUnits} />
                </h3>
                <div className="flex items-center gap-1 text-xs text-secondary">
                  <TrendingUp className="w-3 h-3" />
                  <span>+8%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="rounded-[20px] shadow-lg border-border hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-4 md:p-5">
              <p className="text-xs md:text-sm text-muted-foreground mb-1">Vacant Units</p>
              <div className="flex items-end justify-between">
                <h3 className="text-2xl md:text-3xl text-secondary">
                  <AnimatedCounter value={vacantUnits} />
                </h3>
                <div className="flex items-center gap-1 text-xs text-destructive">
                  <TrendingDown className="w-3 h-3" />
                  <span>-5%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="rounded-[20px] shadow-lg border-border hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-4 md:p-5">
              <p className="text-xs md:text-sm text-muted-foreground mb-1">Maintenance Ongoing</p>
              <div className="flex items-end justify-between">
                <h3 className="text-2xl md:text-3xl text-muted-foreground">
                  <AnimatedCounter value={maintenanceOngoing} />
                </h3>
                <Badge variant="outline" className="rounded-lg text-xs">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="rounded-[20px] shadow-lg border-border">
          <CardContent className="p-4 md:p-5">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-[16px] bg-input-background border-border"
                />
              </div>
              <Select value={typeFilter} onValueChange={(value) => { setTypeFilter(value); updateActiveFilters(); }}>
                <SelectTrigger className="w-full md:w-48 rounded-[16px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); updateActiveFilters(); }}>
                <SelectTrigger className="w-full md:w-48 rounded-[16px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48 rounded-[16px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-high">Price: High - Low</SelectItem>
                  <SelectItem value="price-low">Price: Low - High</SelectItem>
                  <SelectItem value="roi">ROI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Filters Pills */}
      <AnimatePresence>
        {activeFilters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 items-center"
          >
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {activeFilters.map((filter, index) => (
              <motion.div
                key={filter}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
              >
                <Badge variant="secondary" className="rounded-lg pl-3 pr-2 py-1">
                  {filter}
                  <button
                    onClick={() => clearFilter(filter)}
                    className="ml-2 hover:bg-background/50 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              </motion.div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="rounded-lg text-xs h-7"
            >
              Clear All
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Properties Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${searchQuery}-${typeFilter}-${statusFilter}-${sortBy}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6"
          >
            {sortedProperties.map((property, index) => {
              // Mobile swipe support
              const PropertyCard = () => {
                const { ref, isSwiping } = useSwipeGesture<HTMLDivElement>({
                  onSwipeRight: () => {
                    if (isMobile) {
                      handlePropertyClick(property);
                    }
                  },
                  threshold: 100,
                });

                return (
                  <Card 
                    ref={ref}
                    className={`rounded-[16px] md:rounded-[20px] shadow-md md:shadow-lg border-border overflow-hidden hover:shadow-xl md:hover:shadow-2xl hover:border-primary/30 transition-all duration-300 cursor-pointer group h-full touch-manipulation ${isSwiping ? 'scale-98' : ''}`}
                  >
                    <div 
                      className="relative h-48 md:h-56 overflow-hidden"
                      onClick={() => handlePropertyClick(property)}
                    >
                    <ImageWithFallback
                      src={property.image}
                      alt={property.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 right-3">
                      <Badge className={`${statusConfig[property.status as keyof typeof statusConfig].color} text-white rounded-lg shadow-md`}>
                        {statusConfig[property.status as keyof typeof statusConfig].label}
                      </Badge>
                    </div>
                  </div>
                  
                    <CardContent className="p-4 md:p-5">
                      <h3 className="mb-1 group-hover:text-primary transition-colors text-base md:text-lg">
                        {property.name}
                      </h3>
                      <div className="flex items-center gap-1 text-muted-foreground mb-3">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="text-xs md:text-sm truncate">{property.location}</span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-border mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground">{property.type}</p>
                          <p className="text-sm md:text-base text-primary">{property.price}/mo</p>
                        </div>
                        <div className="text-xs md:text-sm text-muted-foreground">
                          {property.beds > 0 && `${property.beds} bed`}
                          {property.beds > 0 && property.baths > 0 && " • "}
                          {property.baths > 0 && `${property.baths} bath`}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-3 border-t border-border">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-[12px] text-xs min-h-[44px] md:min-h-0 touch-manipulation"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePropertyClick(property);
                          }}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-[12px] text-xs min-h-[44px] md:min-h-0 touch-manipulation"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick();
                          }}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          {isMobile ? '' : 'Edit'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-[12px] text-xs text-destructive hover:text-destructive min-h-[44px] md:min-h-0 min-w-[44px] md:min-w-0 touch-manipulation"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(property.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              };

              return (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * Math.min(index, 6) }}
                  whileHover={isMobile ? {} : { y: -8, transition: { duration: 0.2 } }}
                >
                  <PropertyCard />
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {filteredProperties.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2">No properties found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="rounded-[16px]"
            >
              Clear All Filters
            </Button>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <AddPropertyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <PropertyDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        property={selectedProperty}
        onEdit={handleEditClick}
        onDelete={() => selectedProperty && handleDeleteClick(selectedProperty.id)}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={propertyToDelete !== null} onOpenChange={() => setPropertyToDelete(null)}>
        <AlertDialogContent className="rounded-[20px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this property? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-[16px]">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="rounded-[16px] bg-destructive hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
