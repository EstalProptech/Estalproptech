import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { 
  X, 
  MapPin, 
  Calendar, 
  User, 
  DollarSign, 
  Clock,
  CheckCircle2,
  Circle,
  Download,
  Paperclip,
  Send
} from "lucide-react";
import { MaintenanceRequest, MaintenanceComment, Technician } from "../data/maintenanceData";
import { motion } from "motion/react";
import { useState } from "react";

interface MaintenanceRequestModalProps {
  request: MaintenanceRequest | null;
  comments: MaintenanceComment[];
  technician: Technician | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusConfig = {
  'New': { color: 'bg-gray-500', textColor: 'text-gray-500', icon: Circle },
  'In Progress': { color: 'bg-[#D9C58E]', textColor: 'text-[#D9C58E]', icon: Clock },
  'Completed': { color: 'bg-[#5B6E49]', textColor: 'text-[#5B6E49]', icon: CheckCircle2 },
  'Canceled': { color: 'bg-gray-400', textColor: 'text-gray-400', icon: X },
};

const priorityConfig = {
  'Low': { color: 'bg-gray-500', dotColor: 'bg-gray-500' },
  'Medium': { color: 'bg-[#F59E0B]', dotColor: 'bg-[#F59E0B]' },
  'High': { color: 'bg-[#EF4444]', dotColor: 'bg-[#EF4444]' },
  'Urgent': { color: 'bg-[#DC2626]', dotColor: 'bg-[#DC2626]' },
};

export function MaintenanceRequestModal({
  request,
  comments,
  technician,
  isOpen,
  onClose,
}: MaintenanceRequestModalProps) {
  const [newComment, setNewComment] = useState('');

  if (!request) return null;

  const StatusIcon = statusConfig[request.status].icon;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      // In a real app, this would call an API
      console.log('Adding comment:', newComment);
      setNewComment('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0 rounded-[24px]">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border p-6 z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{request.id}</span>
                  <Badge className={`${statusConfig[request.status].color} text-white rounded-xl`}>
                    {request.status}
                  </Badge>
                  <Badge className={`${priorityConfig[request.priority].color} text-white rounded-xl`}>
                    {request.priority}
                  </Badge>
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{request.propertyName}</span>
                </DialogDescription>
              </DialogHeader>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-xl"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            {/* Status Timeline */}
            <div className="space-y-3">
              <h3>Status Timeline</h3>
              <div className="relative">
                <div className="absolute left-[11px] top-8 bottom-8 w-0.5 bg-border" />
                
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3"
                  >
                    <div className={`w-6 h-6 rounded-full ${request.status === 'New' || request.status === 'In Progress' || request.status === 'Completed' ? 'bg-primary' : 'bg-muted'} flex items-center justify-center relative z-10`}>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm">Submitted</p>
                      <p className="text-xs text-muted-foreground">{formatDate(request.createdAt)}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className={`w-6 h-6 rounded-full ${request.assignedTo ? 'bg-primary' : 'bg-muted'} flex items-center justify-center relative z-10`}>
                      {request.assignedTo ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm">Assigned</p>
                      {request.assignedTo && (
                        <p className="text-xs text-muted-foreground">To {request.assignedTo}</p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-start gap-3"
                  >
                    <div className={`w-6 h-6 rounded-full ${request.status === 'In Progress' || request.status === 'Completed' ? 'bg-primary' : 'bg-muted'} flex items-center justify-center relative z-10`}>
                      {request.status === 'In Progress' || request.status === 'Completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm">In Progress</p>
                      {(request.status === 'In Progress' || request.status === 'Completed') && (
                        <p className="text-xs text-muted-foreground">{formatDate(request.updatedAt)}</p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-start gap-3"
                  >
                    <div className={`w-6 h-6 rounded-full ${request.status === 'Completed' ? 'bg-secondary' : 'bg-muted'} flex items-center justify-center relative z-10`}>
                      {request.status === 'Completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm">Completed</p>
                      {request.completedAt && (
                        <p className="text-xs text-muted-foreground">{formatDate(request.completedAt)}</p>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Request Details */}
            <div className="space-y-4">
              <h3>Request Details</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p>{request.category}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Created By</p>
                  <p>{request.createdBy}</p>
                </div>

                {request.estimatedCost && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Estimated Cost</p>
                    <p className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {request.estimatedCost.toLocaleString()} SAR
                    </p>
                  </div>
                )}

                {request.actualCost && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Actual Cost</p>
                    <p className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {request.actualCost.toLocaleString()} SAR
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-sm leading-relaxed bg-muted/30 p-4 rounded-[16px]">
                  {request.description}
                </p>
              </div>
            </div>

            {/* Technician Info */}
            {technician && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3>Assigned Technician</h3>
                  <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-[16px]">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={technician.avatar} alt={technician.name} />
                      <AvatarFallback>{technician.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{technician.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {technician.specialty.join(', ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Contact</p>
                      <p className="text-sm">{technician.phone}</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Attachments */}
            {request.attachments && request.attachments.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3>Attachments</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {request.attachments.map((attachment, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative aspect-square rounded-[16px] overflow-hidden group cursor-pointer"
                      >
                        <img
                          src={attachment}
                          alt={`Attachment ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Download className="w-6 h-6 text-white" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Comments Section */}
            <Separator />
            <div className="space-y-4">
              <h3>Comments ({comments.length})</h3>
              
              <div className="space-y-3">
                {comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  comments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-3 p-4 bg-muted/30 rounded-[16px]"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{comment.authorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{comment.authorName}</p>
                          <Badge variant="outline" className="text-xs rounded-lg">
                            {comment.authorRole}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </p>
                        <p className="text-sm mt-2">{comment.content}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Add Comment */}
              <div className="space-y-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="rounded-[16px] min-h-[100px]"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="rounded-[16px] gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Add Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-background border-t border-border p-6">
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 rounded-[16px] gap-2">
              <Download className="w-4 h-4" />
              Download Report
            </Button>
            <Button className="flex-1 rounded-[16px]">
              Update Status
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
