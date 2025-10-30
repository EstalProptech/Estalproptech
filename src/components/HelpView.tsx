import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Search, BookOpen, MessageCircle, Mail, FileText, Video, HelpCircle, Settings, DollarSign, Wrench, LifeBuoy, Phone, Database, GitBranch } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigation } from "./NavigationContext";

const helpCategories = [
  {
    icon: BookOpen,
    title: "Getting Started",
    description: "Learn the basics of Estal PropTech platform",
    articles: 12,
    color: "primary",
    action: null
  },
  {
    icon: Database,
    title: "KV Store Data Flow Architecture",
    description: "Interactive visualization of caching & optimization",
    articles: 1,
    color: "primary",
    action: "data-flow-diagram",
    badge: "New"
  },
  {
    icon: FileText,
    title: "Property Management",
    description: "Manage your properties effectively",
    articles: 24,
    color: "secondary",
    action: null
  },
  {
    icon: Wrench,
    title: "Maintenance & Requests",
    description: "Handle maintenance and service requests",
    articles: 18,
    color: "accent",
    action: null
  },
  {
    icon: DollarSign,
    title: "Billing & Reports",
    description: "Financial management and reporting",
    articles: 16,
    color: "primary",
    action: null
  },
  {
    icon: Settings,
    title: "Account & Settings",
    description: "Manage your account preferences",
    articles: 10,
    color: "secondary",
    action: null
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Step-by-step video guides",
    articles: 8,
    color: "accent",
    action: null
  }
];

const faqs = [
  {
    category: "Getting Started",
    question: "How do I add a new property to my portfolio?",
    answer: "To add a new property, click the 'Add Property' button in the Dashboard or Properties section. Fill in all required details including property name, location, type, and pricing information. You can also upload property images and documents. Once submitted, the property will appear in your portfolio immediately."
  },
  {
    category: "Property Management",
    question: "Can I manage multiple property types in one account?",
    answer: "Yes, Estal PropTech supports all property types including apartments, villas, commercial spaces, and mixed-use buildings. You can filter and organize properties by type, location, or custom tags for easy management."
  },
  {
    category: "Reports",
    question: "How can I export financial reports?",
    answer: "Navigate to the Reports section from the sidebar. Select the report type (financial, occupancy, maintenance, etc.), choose your date range, and click the 'Export' button. Reports can be downloaded in PDF or Excel format. You can also schedule automated email reports."
  },
  {
    category: "Maintenance",
    question: "How do I track maintenance requests?",
    answer: "Visit the Maintenance section to view all active, pending, and completed maintenance requests. Each request shows the assigned staff, status, priority level, and estimated completion time. You can filter by property, status, or date range. Real-time updates are provided when status changes occur."
  },
  {
    category: "Settings",
    question: "How do I change my account settings and preferences?",
    answer: "Go to Settings from the sidebar where you can update your profile information, change password, set notification preferences, manage team members, and configure security settings. Changes are saved automatically."
  },
  {
    category: "Payments",
    question: "What payment methods are supported?",
    answer: "We support all major credit cards (Visa, Mastercard, Amex), bank transfers, and local payment methods including STC Pay, Apple Pay, and Mada. You can set up automatic payment collection for tenant rent and manage payment schedules."
  },
  {
    category: "Mobile Access",
    question: "Can I use the platform on mobile devices?",
    answer: "Yes, Estal PropTech is fully responsive and works seamlessly on desktop, tablet, and mobile devices. You can access all features through your mobile browser. We also offer native mobile apps for iOS and Android with offline capabilities."
  },
  {
    category: "Data Security",
    question: "How is my data protected?",
    answer: "We use bank-level encryption (256-bit SSL) for all data transmission and storage. All servers are hosted in secure data centers with 24/7 monitoring. We perform regular security audits and comply with international data protection standards including GDPR and PDPL."
  },
  {
    category: "Team Management",
    question: "Can I add team members and assign roles?",
    answer: "Yes, you can invite unlimited team members and assign specific roles (Admin, Manager, Staff, Viewer). Each role has different permission levels. Go to Settings > Team Management to invite members and configure their access rights."
  },
  {
    category: "Support",
    question: "What support options are available?",
    answer: "We offer 24/7 support through live chat, email, and phone. Premium users also have access to dedicated account managers and priority support. You can also access our comprehensive knowledge base and video tutorials anytime."
  }
];

export function HelpView() {
  const [searchQuery, setSearchQuery] = useState("");
  const { navigate } = useNavigation();

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl md:text-4xl mb-2">Help Center</h1>
        <p className="text-muted-foreground">Get help with Estal PropTech platform</p>
      </motion.div>

      {/* Search */}
      <motion.div
        className="relative max-w-2xl mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="How can we help you? Search for articles, guides, or FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-4 py-6 rounded-[20px] shadow-lg"
        />
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="rounded-[20px] shadow-lg border-border hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <motion.div
                className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="w-7 h-7 text-primary" />
              </motion.div>
              <h3 className="mb-2">Live Chat</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Chat with our support team instantly
              </p>
              <Button variant="outline" className="rounded-[16px] group-hover:bg-primary group-hover:text-white transition-colors">
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="rounded-[20px] shadow-lg border-border hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <motion.div
                className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-3"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Mail className="w-7 h-7 text-secondary" />
              </motion.div>
              <h3 className="mb-2">Email Support</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get detailed help via email
              </p>
              <Button variant="outline" className="rounded-[16px] group-hover:bg-secondary group-hover:text-white transition-colors">
                Send Email
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="rounded-[20px] shadow-lg border-border hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <motion.div
                className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-3"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Video className="w-7 h-7 text-accent" />
              </motion.div>
              <h3 className="mb-2">Video Call</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Schedule a video session with us
              </p>
              <Button variant="outline" className="rounded-[16px] group-hover:bg-accent group-hover:text-white transition-colors">
                Schedule Call
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Help Categories */}
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl mb-4">Browse by Category</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {helpCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + 0.1 * index }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={() => category.action && navigate(category.action)}
              >
                <Card className="rounded-[20px] shadow-lg border-border hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-12 h-12 rounded-2xl bg-${category.color}/10 flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 text-${category.color}`} />
                      </div>
                      {category.badge && (
                        <Badge variant="default" className="rounded-[6px] text-xs">
                          {category.badge}
                        </Badge>
                      )}
                    </div>
                    <h3 className="mb-2">{category.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {category.articles} {category.articles === 1 ? 'article' : 'articles'}
                      </p>
                      <Button variant="ghost" size="sm" className="rounded-[12px] text-xs">
                        {category.action ? 'View →' : 'Browse →'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* FAQs with Accordion */}
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-xl mb-4">Frequently Asked Questions</h2>
          {searchQuery && (
            <p className="text-sm text-muted-foreground mb-4">
              Found {filteredFaqs.length} {filteredFaqs.length === 1 ? 'result' : 'results'}
            </p>
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="rounded-[20px] shadow-lg border-border">
            <CardContent className="p-4 md:p-6">
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border-border"
                  >
                    <AccordionTrigger className="hover:no-underline py-4 text-left">
                      <div className="flex items-start gap-3 pr-4">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                          <HelpCircle className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="mb-1">{faq.question}</h4>
                          <Badge variant="outline" className="rounded-lg text-xs">
                            {faq.category}
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-11 pr-4 pb-4">
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {filteredFaqs.length === 0 && (
                <div className="text-center py-12">
                  <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No FAQs found matching your search.</p>
                  <p className="text-sm text-muted-foreground mt-2">Try different keywords or browse by category.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AI Assistant CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <Card className="rounded-[20px] shadow-lg border-border bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardContent className="p-8 md:p-12 text-center relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
              <LifeBuoy className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl mb-2">Ask Estal AI Assistant</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Get instant answers to your questions using our AI-powered assistant. 
              It can help you with property management, maintenance tracking, financial reports, and more.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button className="rounded-[16px] bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-300 shadow-md">
                <MessageCircle className="w-4 h-4 mr-2" />
                Open AI Assistant
              </Button>
              <Button variant="outline" className="rounded-[16px]">
                View Documentation
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
      >
        <Card className="rounded-[20px] shadow-lg border-border">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl mb-2">Still need help?</h2>
            <p className="text-muted-foreground mb-6">
              Our support team is available 24/7 to assist you with any questions or issues
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button className="rounded-[16px] bg-primary hover:bg-secondary shadow-md hover:shadow-lg transition-all duration-300">
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline" className="rounded-[16px]">
                <Phone className="w-4 h-4 mr-2" />
                +966 800 123 4567
              </Button>
            </div>
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Average response time: <span className="text-primary">under 2 minutes</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
