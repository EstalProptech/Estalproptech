import { useState, useMemo } from "react";
import { 
  Plus, 
  Filter, 
  Search, 
  Download, 
  Sparkles,
  Eye,
  Calendar as CalendarIcon,
  ChevronDown,
  ArrowUpDown,
  MoreVertical,
  Upload,
  MapPin,
  User
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { motion, AnimatePresence } from "motion/react";
import { maintenanceRequests, technicians, maintenanceComments } from "../data/maintenanceData";
import { MaintenanceAIInsights } from "./MaintenanceAIInsights";
import { MaintenanceRequestModal } from "./MaintenanceRequestModal";
import { toast } from "sonner@2.0.3";
import type { MaintenanceRequest } from "../data/maintenanceData";
import { useIsMobile } from "./ui/use-mobile";
import { useSwipeGesture } from "../hooks/useSwipeGesture";
import { ResponsiveTableCard, ResponsiveTableRow } from "./ResponsiveTableCard";

const statusConfig = {
  'All': { color: 'bg-gray-500', label: 'All' },
  'New': { color: 'bg-gray-500', label: 'New' },
  'In Progress': { color: 'bg-[#D9C58E]', label: 'In Progress' },
  'Completed': { color: 'bg-[#5B6E49]', label: 'Completed' },
  'Canceled': { color: 'bg-gray-400', label: 'Canceled' },
};

const priorityConfig = {
  'All': { color: 'bg-gray-500', label: 'All' },
  'Low': { color: 'bg-gray-500', label: 'Low' },
  'Medium': { color: 'bg-[#F59E0B]', label: 'Medium' },
  'High': { color: 'bg-[#EF4444]', label: 'High' },
  'Urgent': { color: 'bg-[#DC2626]', label: 'Urgent' },
};

const categories = ['All', 'AC', 'Plumbing', 'Electrical', 'Cleaning', 'Other'];

export function MaintenanceView() {
  const isMobile = useIsMobile();
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [isAIInsightsOpen, setIsAIInsightsOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [technicianFilter, setTechnicianFilter] = useState<string>('All');
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);
  
  // New request form states
  const [newRequest, setNewRequest] = useState({
    property: '',
    category: '',
    description: '',
    priority: '',
    assignedTo: '',
  });

  // Filtered and sorted requests
  const filteredRequests = useMemo(() => {
    return maintenanceRequests.filter(request => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !request.id.toLowerCase().includes(query) &&
          !request.propertyName.toLowerCase().includes(query) &&
          !request.description.toLowerCase().includes(query) &&
          !(request.assignedTo?.toLowerCase().includes(query))
        ) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'All' && request.status !== statusFilter) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== 'All' && request.priority !== priorityFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'All' && request.category !== categoryFilter) {
        return false;
      }

      // Technician filter
      if (technicianFilter !== 'All' && request.assignedTo !== technicianFilter) {
        return false;
      }

      // Date range filter
      if (dateFrom) {
        const requestDate = new Date(request.createdAt);
        if (requestDate < dateFrom) {
          return false;
        }
      }

      if (dateTo) {
        const requestDate = new Date(request.createdAt);
        if (requestDate > dateTo) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, statusFilter, priorityFilter, categoryFilter, technicianFilter, dateFrom, dateTo]);

  // Summary stats
  const stats = useMemo(() => {
    return {
      total: maintenanceRequests.length,
      new: maintenanceRequests.filter(r => r.status === 'New').length,
      inProgress: maintenanceRequests.filter(r => r.status === 'In Progress').length,
      completed: maintenanceRequests.filter(r => r.status === 'Completed').length,
      urgent: maintenanceRequests.filter(r => r.priority === 'Urgent').length,
    };
  }, []);

  const handleCreateRequest = () => {
    // In a real app, this would call an API
    console.log('Creating request:', newRequest);
    toast.success('Maintenance request created successfully!');
    setIsNewRequestOpen(false);
    setNewRequest({
      property: '',
      category: '',
      description: '',
      priority: '',
      assignedTo: '',
    });
  };

  const handleViewRequest = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setIsDetailsModalOpen(true);
  };

  const handleExport = () => {
    toast.success('Exporting maintenance data...');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setCategoryFilter('All');
    setTechnicianFilter('All');
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1>Maintenance Management</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage all maintenance requests across properties
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="rounded-[16px] gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {showFilters && <ChevronDown className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setIsAIInsightsOpen(true)}
            className="rounded-[16px] gap-2"
          >
            <Sparkles className="w-4 h-4" />
            AI Insights
          </Button>

          <Button
            variant="outline"
            onClick={handleExport}
            className="rounded-[16px] gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>

          <Button
            onClick={() => setIsNewRequestOpen(true)}
            className="rounded-[16px] gap-2 shadow-lg shadow-primary/30"
          >
            <Plus className="w-4 h-4" />
            New Request
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="rounded-[20px] border-border">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Total Requests</p>
              <p className="text-2xl">{stats.total}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="rounded-[20px] border-border">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">New</p>
              <p className="text-2xl text-gray-500">{stats.new}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="rounded-[20px] border-border">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">In Progress</p>
              <p className="text-2xl text-[#D9C58E]">{stats.inProgress}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="rounded-[20px] border-border">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Completed</p>
              <p className="text-2xl text-[#5B6E49]">{stats.completed}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="rounded-[20px] border-border">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Urgent</p>
              <p className="text-2xl text-destructive">{stats.urgent}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters Bar */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="rounded-[20px] border-border overflow-hidden">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3>Filters</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetFilters}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Reset All
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {/* Search */}
                    <div className="space-y-2 md:col-span-2">
                      <Label>Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="ID, property, description..."
                          className="pl-10 rounded-[16px]"
                        />
                      </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="rounded-[16px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(statusConfig).map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Priority */}
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger className="rounded-[16px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(priorityConfig).map(priority => (
                            <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="rounded-[16px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Technician */}
                    <div className="space-y-2 md:col-span-2">
                      <Label>Assigned Technician</Label>
                      <Select value={technicianFilter} onValueChange={setTechnicianFilter}>
                        <SelectTrigger className="rounded-[16px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All Technicians</SelectItem>
                          {technicians.map(tech => (
                            <SelectItem key={tech.id} value={tech.name}>{tech.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Date From */}
                    <div className="space-y-2">
                      <Label>From Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left rounded-[16px]"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateFrom ? formatDate(dateFrom.toISOString()) : 'Pick date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateFrom}
                            onSelect={setDateFrom}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Date To */}
                    <div className="space-y-2">
                      <Label>To Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left rounded-[16px]"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateTo ? formatDate(dateTo.toISOString()) : 'Pick date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateTo}
                            onSelect={setDateTo}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Maintenance Requests Table */}
      <Card className="rounded-[20px] border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Maintenance Requests ({filteredRequests.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block rounded-[16px] border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead>Request ID</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                      No maintenance requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request, index) => (
                    <motion.tr
                      key={request.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-muted/30 cursor-pointer transition-colors"
                      onClick={() => handleViewRequest(request)}
                    >
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {request.propertyName}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="rounded-lg">
                          {request.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[250px] truncate">
                        {request.description}
                      </TableCell>
                      <TableCell>
                        {request.assignedTo || (
                          <span className="text-muted-foreground">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${statusConfig[request.status as keyof typeof statusConfig].color} text-white rounded-lg`}
                        >
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${priorityConfig[request.priority as keyof typeof priorityConfig].color} text-white rounded-lg`}
                        >
                          {request.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(request.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewRequest(request);
                          }}
                          className="rounded-xl"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View - Enhanced with swipe gestures */}
          <div className="md:hidden space-y-3">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No maintenance requests found
              </div>
            ) : (
              filteredRequests.map((request, index) => {
                const MaintenanceCard = () => {
                  const { ref, isSwiping } = useSwipeGesture<HTMLDivElement>({
                    onSwipeRight: () => handleViewRequest(request),
                    threshold: 100,
                  });

                  return (
                    <motion.div
                      ref={ref}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleViewRequest(request)}
                      className={`p-4 border border-border rounded-[16px] space-y-3 hover:bg-muted/30 transition-all cursor-pointer touch-manipulation ${isSwiping ? 'scale-98' : ''}`}
                    >
                      <div className="flex items-start justify-between min-h-[44px]">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{request.id}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{request.propertyName}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewRequest(request);
                          }}
                          className="rounded-xl min-h-[44px] min-w-[44px] ml-2 flex-shrink-0"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="rounded-lg text-xs">
                          {request.category}
                        </Badge>
                        <Badge
                          className={`${statusConfig[request.status as keyof typeof statusConfig].color} text-white rounded-lg text-xs`}
                        >
                          {request.status}
                        </Badge>
                        <Badge
                          className={`${priorityConfig[request.priority as keyof typeof priorityConfig].color} text-white rounded-lg text-xs`}
                        >
                          {request.priority}
                        </Badge>
                      </div>

                      <p className="text-sm line-clamp-2 text-muted-foreground">{request.description}</p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                        <div className="flex items-center gap-1 truncate flex-1">
                          <User className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{request.assignedTo || 'Unassigned'}</span>
                        </div>
                        <span className="text-xs flex-shrink-0 ml-2">{formatDate(request.createdAt)}</span>
                      </div>
                    </motion.div>
                  );
                };

                return <MaintenanceCard key={request.id} />;
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* New Request Modal */}
      <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-[24px]">
          <DialogHeader>
            <DialogTitle>New Maintenance Request</DialogTitle>
            <DialogDescription>
              Create a new maintenance request for a property
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="property">Property *</Label>
              <Select
                value={newRequest.property}
                onValueChange={(value) => setNewRequest({ ...newRequest, property: value })}
              >
                <SelectTrigger id="property" className="rounded-[16px]">
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prop-1">North View Tower - Unit 402</SelectItem>
                  <SelectItem value="prop-2">Al Arid Villa</SelectItem>
                  <SelectItem value="prop-3">Green Park Residences</SelectItem>
                  <SelectItem value="prop-4">Skyline Apartments</SelectItem>
                  <SelectItem value="prop-5">Downtown Loft 8B</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={newRequest.category}
                onValueChange={(value) => setNewRequest({ ...newRequest, category: value })}
              >
                <SelectTrigger id="category" className="rounded-[16px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AC">AC</SelectItem>
                  <SelectItem value="Plumbing">Plumbing</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Cleaning">Cleaning</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select
                value={newRequest.priority}
                onValueChange={(value) => setNewRequest({ ...newRequest, priority: value })}
              >
                <SelectTrigger id="priority" className="rounded-[16px]">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assign Technician (Optional)</Label>
              <Select
                value={newRequest.assignedTo}
                onValueChange={(value) => setNewRequest({ ...newRequest, assignedTo: value })}
              >
                <SelectTrigger id="assignedTo" className="rounded-[16px]">
                  <SelectValue placeholder="Select technician" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {technicians
                    .filter(tech => tech.availability)
                    .map(tech => (
                      <SelectItem key={tech.id} value={tech.name}>
                        {tech.name} - {tech.specialty.join(', ')}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={newRequest.description}
                onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                placeholder="Describe the maintenance issue in detail..."
                className="rounded-[16px] min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Upload Images (Optional)</Label>
              <div className="border-2 border-dashed border-border rounded-[16px] p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG up to 10MB
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewRequestOpen(false)}
              className="rounded-[16px]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateRequest}
              disabled={!newRequest.property || !newRequest.category || !newRequest.priority || !newRequest.description}
              className="rounded-[16px]"
            >
              Create Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Insights Panel */}
      <MaintenanceAIInsights
        isOpen={isAIInsightsOpen}
        onClose={() => setIsAIInsightsOpen(false)}
      />

      {/* Request Details Modal */}
      <MaintenanceRequestModal
        request={selectedRequest}
        comments={selectedRequest ? maintenanceComments.filter(c => c.requestId === selectedRequest.id) : []}
        technician={selectedRequest?.assignedToId ? technicians.find(t => t.id === selectedRequest.assignedToId) || null : null}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedRequest(null);
        }}
      />
    </div>
  );
}
