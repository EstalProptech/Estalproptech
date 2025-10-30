import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { motion } from "motion/react";
import { 
  X, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  User,
  Wrench,
  Edit,
  Trash2
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Property {
  id: number;
  name: string;
  location: string;
  status: string;
  price: string;
  yearlyPrice: string;
  type: string;
  image: string;
  beds: number;
  baths: number;
  size: string;
  owner: string;
  description: string;
  amenities: string[];
  maintenanceRequests: number;
  occupancyRate: string;
  roi: string;
  lastUpdated: string;
}

interface PropertyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  onEdit?: () => void;
  onDelete?: () => void;
}

const statusConfig = {
  available: { label: 'Available', color: 'bg-secondary', textColor: 'text-secondary' },
  rented: { label: 'Rented', color: 'bg-accent', textColor: 'text-accent' },
  maintenance: { label: 'Maintenance', color: 'bg-muted-foreground', textColor: 'text-muted-foreground' },
};

export function PropertyDetailsModal({ 
  isOpen, 
  onClose, 
  property,
  onEdit,
  onDelete 
}: PropertyDetailsModalProps) {
  if (!property) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden rounded-[20px] p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col h-full"
        >
          {/* Header Image */}
          <div className="relative h-80 overflow-hidden">
            <ImageWithFallback
              src={property.image}
              alt={property.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Property Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <DialogHeader>
                    <DialogTitle className="text-3xl text-white mb-2">
                      {property.name}
                    </DialogTitle>
                    <DialogDescription className="flex items-center gap-2 text-white/90 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{property.location}</span>
                    </DialogDescription>
                  </DialogHeader>
                  <Badge 
                    className={`${statusConfig[property.status as keyof typeof statusConfig].color} text-white rounded-lg`}
                  >
                    {statusConfig[property.status as keyof typeof statusConfig].label}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/80 mb-1">Monthly Rent</p>
                  <p className="text-3xl text-white">{property.price}</p>
                  <p className="text-sm text-white/80 mt-1">{property.yearlyPrice}/year</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1">
            <div className="p-6 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="rounded-[16px]">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Bed className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Bedrooms</p>
                        <p className="text-lg">{property.beds}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-[16px]">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                        <Bath className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Bathrooms</p>
                        <p className="text-lg">{property.baths}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-[16px]">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                        <Square className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Size</p>
                        <p className="text-lg">{property.size}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-[16px]">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Type</p>
                        <p className="text-lg">{property.type}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Description */}
              <div>
                <h3 className="mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline" className="rounded-lg">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Financial & Maintenance Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Financial Summary */}
                <Card className="rounded-[16px]">
                  <CardContent className="p-5">
                    <h4 className="mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-primary" />
                      Financial Summary
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Occupancy Rate</span>
                        <span className="text-primary">{property.occupancyRate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">ROI (Annual)</span>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-secondary" />
                          <span className="text-secondary">{property.roi}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Owner</span>
                        <span>{property.owner}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Last Updated</span>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <span>{property.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Maintenance Summary */}
                <Card className="rounded-[16px]">
                  <CardContent className="p-5">
                    <h4 className="mb-4 flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-accent" />
                      Maintenance
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Active Requests</span>
                        <Badge 
                          variant={property.maintenanceRequests > 0 ? "destructive" : "outline"}
                          className="rounded-lg"
                        >
                          {property.maintenanceRequests}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Last Service</span>
                        <span className="text-sm">Oct 10, 2025</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Next Inspection</span>
                        <span className="text-sm">Nov 15, 2025</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <Badge variant="outline" className="rounded-lg text-secondary">
                          Good Condition
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-border p-4 bg-muted/30">
            <div className="flex justify-between gap-3">
              <Button 
                variant="outline" 
                className="rounded-[16px]"
                onClick={onClose}
              >
                Close
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="rounded-[16px] text-destructive hover:text-destructive"
                  onClick={onDelete}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <Button
                  className="rounded-[16px]"
                  onClick={onEdit}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Property
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
