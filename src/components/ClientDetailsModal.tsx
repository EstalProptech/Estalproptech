import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Building2, DollarSign, Calendar, TrendingUp, Plus } from "lucide-react";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  properties: number;
  totalValue: string;
  status: string;
  avatar: string;
  location: string;
}

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

export function ClientDetailsModal({ isOpen, onClose, client }: ClientDetailsModalProps) {
  if (!client) return null;

  const clientProperties = [
    {
      id: 1,
      name: "Skyline Tower Unit 402",
      type: "Apartment",
      status: "Rented",
      monthlyRevenue: "25,000 SAR",
      occupancy: "100%"
    },
    {
      id: 2,
      name: "Garden Villa 12",
      type: "Villa",
      status: "Rented",
      monthlyRevenue: "45,000 SAR",
      occupancy: "100%"
    },
    {
      id: 3,
      name: "Downtown Loft 8B",
      type: "Loft",
      status: "Vacant",
      monthlyRevenue: "0 SAR",
      occupancy: "0%"
    }
  ];

  const transactions = [
    {
      id: 1,
      type: "Rent Payment",
      property: "Skyline Tower Unit 402",
      amount: "25,000 SAR",
      date: "Oct 15, 2025",
      status: "Completed"
    },
    {
      id: 2,
      type: "Rent Payment",
      property: "Garden Villa 12",
      amount: "45,000 SAR",
      date: "Oct 15, 2025",
      status: "Completed"
    },
    {
      id: 3,
      type: "Maintenance Fee",
      property: "Skyline Tower Unit 402",
      amount: "-2,500 SAR",
      date: "Oct 10, 2025",
      status: "Paid"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden rounded-[20px] p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-primary to-secondary p-6">
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16 border-4 border-white">
                <AvatarImage src={client.avatar} alt={client.name} />
                <AvatarFallback className="bg-white text-primary text-xl">
                  {client.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-white mb-1">
                    {client.name}
                  </DialogTitle>
                  <DialogDescription className="flex flex-wrap items-center gap-3 text-white/90">
                    <span className="flex items-center gap-1 text-sm">
                      <MapPin className="w-3 h-3" />
                      {client.location}
                    </span>
                    <Badge variant={client.status === "Active" ? "default" : "outline"} className="rounded-lg">
                      {client.status}
                    </Badge>
                  </DialogDescription>
                </DialogHeader>
              </div>
              <div className="text-right text-white">
                <p className="text-sm opacity-90">Total Portfolio</p>
                <p className="text-2xl">{client.totalValue}</p>
              </div>
            </div>
          </div>

          {/* Quick Contact */}
          <div className="px-6 py-4 bg-muted/30 border-b border-border">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{client.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{client.phone}</span>
              </div>
            </div>
          </div>

          {/* Tabs Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 rounded-[16px] mb-6">
                <TabsTrigger value="overview" className="rounded-[12px]">Overview</TabsTrigger>
                <TabsTrigger value="properties" className="rounded-[12px]">Properties</TabsTrigger>
                <TabsTrigger value="transactions" className="rounded-[12px]">Transactions</TabsTrigger>
                <TabsTrigger value="notes" className="rounded-[12px]">Notes</TabsTrigger>
              </TabsList>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="rounded-[16px]">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Properties</p>
                            <p className="text-xl">{client.properties}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="rounded-[16px]">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-secondary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                            <p className="text-xl">70K SAR</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="rounded-[16px]">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-accent/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-accent" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Occupancy Rate</p>
                            <p className="text-xl">67%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="rounded-[16px]">
                    <CardContent className="p-4">
                      <h4 className="mb-3">Client Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground mb-1">Member Since</p>
                          <p>January 2023</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Last Activity</p>
                          <p>October 15, 2025</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Payment Method</p>
                          <p>Bank Transfer</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Contract Type</p>
                          <p>Long-term Rental</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="properties" className="space-y-3">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-muted-foreground">{clientProperties.length} properties</p>
                    <Button size="sm" className="rounded-[12px]">
                      <Plus className="w-4 h-4 mr-2" />
                      Assign Property
                    </Button>
                  </div>
                  {clientProperties.map((property) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="rounded-[16px] hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="mb-1">{property.name}</h4>
                              <p className="text-sm text-muted-foreground">{property.type}</p>
                            </div>
                            <Badge
                              variant={property.status === "Rented" ? "default" : "outline"}
                              className="rounded-lg"
                            >
                              {property.status}
                            </Badge>
                          </div>
                          <div className="mt-3 pt-3 border-t border-border flex justify-between text-sm">
                            <div>
                              <p className="text-muted-foreground">Monthly Revenue</p>
                              <p className="text-primary">{property.monthlyRevenue}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-muted-foreground">Occupancy</p>
                              <p>{property.occupancy}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </TabsContent>

                <TabsContent value="transactions" className="space-y-3">
                  <p className="text-sm text-muted-foreground mb-4">Recent transactions</p>
                  {transactions.map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="rounded-[16px]">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4>{transaction.type}</h4>
                                <Badge variant="outline" className="rounded-lg text-xs">
                                  {transaction.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{transaction.property}</p>
                            </div>
                            <div className="text-right">
                              <p className={transaction.amount.includes('-') ? 'text-destructive' : 'text-secondary'}>
                                {transaction.amount}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {transaction.date}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <Textarea
                    placeholder="Add notes about this client..."
                    className="min-h-[200px] rounded-[16px]"
                  />
                  <Button className="rounded-[12px]">Save Notes</Button>
                  
                  <div className="mt-6">
                    <h4 className="mb-3">Previous Notes</h4>
                    <div className="space-y-3">
                      <Card className="rounded-[16px]">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-sm">Client requested early lease renewal for Garden Villa 12.</p>
                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">Oct 10</span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="rounded-[16px]">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-sm">Interested in purchasing additional property in Al-Narjis district.</p>
                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">Sep 28</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </motion.div>
            </Tabs>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
