import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, UserPlus, Mail, Phone, MapPin, Building2, Filter, Grid3x3, List } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ScrollArea } from "./ui/scroll-area";
import { ClientDetailsModal } from "./ClientDetailsModal";
import { useIsMobile } from "./ui/use-mobile";
import { useSwipeGesture } from "../hooks/useSwipeGesture";

const clients = [
  {
    id: 1,
    name: "Ahmed Al-Rashid",
    email: "ahmed.rashid@email.com",
    phone: "+966 50 123 4567",
    properties: 3,
    totalValue: "2.5M SAR",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    location: "Riyadh",
    lastActivity: "2 hours ago"
  },
  {
    id: 2,
    name: "Sarah Al-Otaibi",
    email: "sarah.otaibi@email.com",
    phone: "+966 55 234 5678",
    properties: 5,
    totalValue: "4.2M SAR",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    location: "Jeddah",
    lastActivity: "5 hours ago"
  },
  {
    id: 3,
    name: "Mohammed Al-Dosari",
    email: "m.dosari@email.com",
    phone: "+966 56 345 6789",
    properties: 2,
    totalValue: "1.8M SAR",
    status: "Prospect",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    location: "Dammam",
    lastActivity: "1 day ago"
  },
  {
    id: 4,
    name: "Fatima Al-Harbi",
    email: "f.harbi@email.com",
    phone: "+966 54 456 7890",
    properties: 4,
    totalValue: "3.1M SAR",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    location: "Riyadh",
    lastActivity: "3 hours ago"
  },
  {
    id: 5,
    name: "Khalid Al-Zahrani",
    email: "khalid.z@email.com",
    phone: "+966 53 567 8901",
    properties: 1,
    totalValue: "950K SAR",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    location: "Mecca",
    lastActivity: "1 hour ago"
  },
  {
    id: 6,
    name: "Noura Al-Subaie",
    email: "noura.s@email.com",
    phone: "+966 52 678 9012",
    properties: 6,
    totalValue: "5.8M SAR",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    location: "Riyadh",
    lastActivity: "30 minutes ago"
  },
  {
    id: 7,
    name: "Abdullah Al-Ghamdi",
    email: "abdullah.g@email.com",
    phone: "+966 51 789 0123",
    properties: 2,
    totalValue: "1.6M SAR",
    status: "Prospect",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100",
    location: "Riyadh",
    lastActivity: "2 days ago"
  },
  {
    id: 8,
    name: "Layla Al-Mutairi",
    email: "layla.m@email.com",
    phone: "+966 55 890 1234",
    properties: 3,
    totalValue: "2.8M SAR",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
    location: "Jeddah",
    lastActivity: "4 hours ago"
  },
  {
    id: 9,
    name: "Omar Al-Shehri",
    email: "omar.s@email.com",
    phone: "+966 56 901 2345",
    properties: 1,
    totalValue: "850K SAR",
    status: "Archived",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100",
    location: "Dammam",
    lastActivity: "1 week ago"
  }
];

export function ClientsView() {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedClient, setSelectedClient] = useState<typeof clients[0] | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filters = ["All", "Active", "Prospect", "Archived"];

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === "All" || client.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const handleClientClick = (client: typeof clients[0]) => {
    setSelectedClient(client);
    setIsDetailsOpen(true);
  };

  const getStatusCount = (status: string) => {
    if (status === "All") return clients.length;
    return clients.filter(c => c.status === status).length;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl md:text-3xl mb-1 md:mb-2">Clients Overview</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage your property owners and tenants</p>
        </div>
        <Button className="rounded-[16px] bg-primary hover:bg-secondary shadow-md hover:shadow-lg transition-all duration-300 self-start min-h-[44px] touch-manipulation">
          <UserPlus className="w-4 h-4 mr-2" />
          {isMobile ? 'Add' : 'Add Client'}
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="rounded-[20px] shadow-lg border-border hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-4">
              <p className="text-xs md:text-sm text-muted-foreground">Total Clients</p>
              <h3 className="text-xl md:text-2xl mt-1">142</h3>
              <p className="text-xs text-muted-foreground mt-1">+12 this month</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="rounded-[20px] shadow-lg border-border hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-4">
              <p className="text-xs md:text-sm text-muted-foreground">Active</p>
              <h3 className="text-xl md:text-2xl mt-1 text-secondary">128</h3>
              <p className="text-xs text-muted-foreground mt-1">90% active rate</p>
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
            <CardContent className="p-4">
              <p className="text-xs md:text-sm text-muted-foreground">Prospects</p>
              <h3 className="text-xl md:text-2xl mt-1 text-accent">12</h3>
              <p className="text-xs text-muted-foreground mt-1">New leads</p>
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
            <CardContent className="p-4">
              <p className="text-xs md:text-sm text-muted-foreground">Total Portfolio</p>
              <h3 className="text-xl md:text-2xl mt-1 text-primary">18.4M</h3>
              <p className="text-xs text-muted-foreground mt-1">SAR value</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <motion.div
        className="flex flex-col md:flex-row gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search clients by name, email, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-[16px] shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 bg-muted rounded-[16px] p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-[12px] h-9"
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-[12px] h-9"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Filter Chips */}
      <motion.div
        className="flex flex-wrap gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter)}
            className="rounded-[16px] transition-all duration-200"
          >
            {filter}
            <Badge variant="secondary" className="ml-2 rounded-lg">
              {getStatusCount(filter)}
            </Badge>
          </Button>
        ))}
      </motion.div>

      {/* Clients List */}
      <Card className="rounded-[20px] shadow-lg border-border">
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
          <p className="text-sm text-muted-foreground">
            {filteredClients.length} {filteredClients.length === 1 ? 'client' : 'clients'} found
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="px-4 md:px-6 pb-6">
              <AnimatePresence mode="wait">
                {viewMode === "grid" ? (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {filteredClients.map((client, index) => (
                      <motion.div
                        key={client.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * index }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        onClick={() => handleClientClick(client)}
                      >
                        <Card className="rounded-[16px] hover:shadow-lg transition-all duration-300 cursor-pointer border-border">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3 mb-4">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={client.avatar} alt={client.name} />
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {client.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <h4 className="truncate">{client.name}</h4>
                                <Badge
                                  variant={
                                    client.status === "Active" ? "default" : 
                                    client.status === "Prospect" ? "secondary" : 
                                    "outline"
                                  }
                                  className="rounded-lg mt-1"
                                >
                                  {client.status}
                                </Badge>
                              </div>
                            </div>

                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="w-3 h-3" />
                                <span className="truncate text-xs">{client.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="w-3 h-3" />
                                <span className="text-xs">{client.phone}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                <span className="text-xs">{client.location}</span>
                              </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                              <div>
                                <p className="text-xs text-muted-foreground">Properties</p>
                                <p className="text-sm">{client.properties}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">Total Value</p>
                                <p className="text-sm text-primary">{client.totalValue}</p>
                              </div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-border">
                              <p className="text-xs text-muted-foreground">
                                Last activity: {client.lastActivity}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-2"
                  >
                    {filteredClients.map((client, index) => (
                      <motion.div
                        key={client.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                        whileHover={{ x: 4, transition: { duration: 0.2 } }}
                        onClick={() => handleClientClick(client)}
                      >
                        <Card className="rounded-[16px] hover:shadow-md transition-all duration-200 cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={client.avatar} alt={client.name} />
                                  <AvatarFallback className="bg-primary/10 text-primary">
                                    {client.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                  <h4 className="truncate">{client.name}</h4>
                                  <p className="text-sm text-muted-foreground truncate">{client.email}</p>
                                </div>
                              </div>

                              <div className="flex flex-wrap md:flex-nowrap items-center gap-4 md:gap-6">
                                <div className="flex items-center gap-1 text-sm">
                                  <MapPin className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-muted-foreground">{client.location}</span>
                                </div>
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Properties: </span>
                                  <span>{client.properties}</span>
                                </div>
                                <div className="text-sm">
                                  <span className="text-primary">{client.totalValue}</span>
                                </div>
                                <Badge
                                  variant={
                                    client.status === "Active" ? "default" : 
                                    client.status === "Prospect" ? "secondary" : 
                                    "outline"
                                  }
                                  className="rounded-lg"
                                >
                                  {client.status}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <ClientDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        client={selectedClient}
      />
    </div>
  );
}
