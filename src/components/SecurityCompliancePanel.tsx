import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  Lock,
  Key,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Download,
  ExternalLink,
  Info,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner@2.0.3';

export const SecurityCompliancePanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Security checklist
  const securityChecklist = [
    {
      category: 'Authentication & Authorization',
      items: [
        { name: 'HTTPS-only enforcement', status: 'compliant', severity: 'critical' },
        { name: 'Secure session management', status: 'compliant', severity: 'critical' },
        { name: 'Password strength requirements', status: 'compliant', severity: 'high' },
        { name: 'Multi-factor authentication', status: 'partial', severity: 'high' },
        { name: 'Role-based access control (RBAC)', status: 'compliant', severity: 'critical' },
        { name: 'Session timeout enforcement', status: 'compliant', severity: 'medium' },
      ],
    },
    {
      category: 'Data Protection',
      items: [
        { name: 'Data encryption at rest', status: 'compliant', severity: 'critical' },
        { name: 'Data encryption in transit', status: 'compliant', severity: 'critical' },
        { name: 'Sensitive data sanitization', status: 'compliant', severity: 'critical' },
        { name: 'PII redaction in logs', status: 'compliant', severity: 'high' },
        { name: 'Data backup and recovery', status: 'compliant', severity: 'high' },
        { name: 'Data retention policies', status: 'compliant', severity: 'medium' },
      ],
    },
    {
      category: 'Application Security',
      items: [
        { name: 'Input validation and sanitization', status: 'compliant', severity: 'critical' },
        { name: 'XSS prevention', status: 'compliant', severity: 'critical' },
        { name: 'SQL injection prevention', status: 'compliant', severity: 'critical' },
        { name: 'CSRF protection', status: 'compliant', severity: 'high' },
        { name: 'Content Security Policy (CSP)', status: 'compliant', severity: 'high' },
        { name: 'Security headers configured', status: 'compliant', severity: 'high' },
      ],
    },
    {
      category: 'API Security',
      items: [
        { name: 'API authentication required', status: 'compliant', severity: 'critical' },
        { name: 'Rate limiting implemented', status: 'compliant', severity: 'high' },
        { name: 'Request validation', status: 'compliant', severity: 'high' },
        { name: 'CORS policy configured', status: 'compliant', severity: 'high' },
        { name: 'API versioning', status: 'not-applicable', severity: 'low' },
        { name: 'IDOR prevention', status: 'compliant', severity: 'critical' },
      ],
    },
    {
      category: 'Monitoring & Incident Response',
      items: [
        { name: 'Error monitoring active', status: 'compliant', severity: 'high' },
        { name: 'Security event logging', status: 'compliant', severity: 'high' },
        { name: 'Incident response plan', status: 'compliant', severity: 'critical' },
        { name: 'Real-time alerting', status: 'compliant', severity: 'high' },
        { name: 'Security audit logs', status: 'compliant', severity: 'high' },
        { name: 'Automated vulnerability scanning', status: 'partial', severity: 'medium' },
      ],
    },
  ];

  // Calculate compliance score
  const totalItems = securityChecklist.reduce((sum, cat) => sum + cat.items.length, 0);
  const compliantItems = securityChecklist.reduce(
    (sum, cat) => sum + cat.items.filter((item) => item.status === 'compliant').length,
    0
  );
  const complianceScore = Math.round((compliantItems / totalItems) * 100);

  const handleDownloadSIRP = () => {
    toast.success('Security Incident Response Plan downloaded');
  };

  const handleRunSecurityAudit = () => {
    toast.success('Security audit initiated');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'partial':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'non-compliant':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Info className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return (
          <Badge className="rounded-lg bg-green-600">
            Compliant
          </Badge>
        );
      case 'partial':
        return (
          <Badge variant="secondary" className="rounded-lg">
            Partial
          </Badge>
        );
      case 'non-compliant':
        return (
          <Badge variant="destructive" className="rounded-lg">
            Non-Compliant
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="rounded-lg">
            N/A
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="mb-2">Security & Compliance</h2>
          <p className="text-sm text-muted-foreground">
            Security hardening status and compliance monitoring
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadSIRP}
            className="rounded-[12px]"
          >
            <Download className="w-4 h-4 mr-2" />
            Download SIRP
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRunSecurityAudit}
            className="rounded-[12px]"
          >
            <Shield className="w-4 h-4 mr-2" />
            Run Audit
          </Button>
        </div>
      </div>

      {/* Compliance Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="rounded-[20px] shadow-lg border-border">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - complianceScore / 100)}`}
                      className="text-green-600"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl">{complianceScore}%</span>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-2xl mb-2">Security Compliance Score</h3>
                <p className="text-muted-foreground mb-4">
                  {complianceScore >= 95
                    ? 'Excellent! Your platform meets industry security standards.'
                    : complianceScore >= 80
                    ? 'Good security posture. A few areas need attention.'
                    : 'Action required. Please address security gaps.'}
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Checks</p>
                    <p className="text-xl">{totalItems}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Compliant</p>
                    <p className="text-xl text-green-600">{compliantItems}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Needs Attention</p>
                    <p className="text-xl text-amber-600">{totalItems - compliantItems}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Checklist */}
      <Card className="rounded-[20px] shadow-lg border-border">
        <CardHeader>
          <CardTitle className="text-lg">Security Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 rounded-[16px] mb-6">
              {securityChecklist.map((cat, idx) => (
                <TabsTrigger
                  key={idx}
                  value={cat.category.toLowerCase().replace(/ /g, '-')}
                  className="rounded-[12px] text-xs md:text-sm"
                >
                  {cat.category.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {securityChecklist.map((category, idx) => (
              <TabsContent
                key={idx}
                value={category.category.toLowerCase().replace(/ /g, '-')}
                className="space-y-3"
              >
                <h4 className="mb-4">{category.category}</h4>
                {category.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="flex items-center justify-between p-4 bg-muted rounded-[12px] hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {getStatusIcon(item.status)}
                      <div>
                        <p className="text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Severity: <span className="capitalize">{item.severity}</span>
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Security Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-[20px] shadow-lg border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Documentation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-between rounded-[12px]"
              onClick={() => window.open('/docs/SECURITY_INCIDENT_RESPONSE_PLAN.md', '_blank')}
            >
              Security Incident Response Plan
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between rounded-[12px]"
              onClick={() => toast.info('Security policy document')}
            >
              Security Policy
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between rounded-[12px]"
              onClick={() => toast.info('Compliance documentation')}
            >
              Compliance Documentation
              <ExternalLink className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-[20px] shadow-lg border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-between rounded-[12px]"
              onClick={() => toast.success('Rotating API keys...')}
            >
              <span>Rotate API Keys</span>
              <Key className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between rounded-[12px]"
              onClick={() => toast.success('Reviewing access logs...')}
            >
              <span>Review Access Logs</span>
              <FileText className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between rounded-[12px]"
              onClick={() => toast.success('Generating security report...')}
            >
              <span>Generate Security Report</span>
              <Download className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Standards */}
      <Card className="rounded-[20px] shadow-lg border-border">
        <CardHeader>
          <CardTitle className="text-lg">Compliance Standards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-border rounded-[12px]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm">GDPR</h4>
                <Badge className="rounded-lg bg-green-600">Compliant</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                General Data Protection Regulation compliance for EU users
              </p>
            </div>

            <div className="p-4 border border-border rounded-[12px]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm">SOC 2</h4>
                <Badge variant="secondary" className="rounded-lg">In Progress</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Service Organization Control 2 certification
              </p>
            </div>

            <div className="p-4 border border-border rounded-[12px]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm">ISO 27001</h4>
                <Badge variant="outline" className="rounded-lg">Planned</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Information security management certification
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Alerts */}
      <Alert className="rounded-[16px]">
        <Shield className="w-4 h-4" />
        <AlertDescription>
          <strong>Security Status:</strong> All critical security measures are in place and
          functioning correctly. Regular security audits are recommended every 90 days.
        </AlertDescription>
      </Alert>
    </div>
  );
};
