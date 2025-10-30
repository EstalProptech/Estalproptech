import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Gift,
  Users,
  Mail,
  Copy,
  CheckCircle2,
  Share2,
  Trophy,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';
import { projectId } from '../utils/supabase/info';

interface Referral {
  id: number;
  referred_email: string;
  status: 'pending' | 'accepted' | 'activated';
  created_at: string;
  reward_earned?: boolean;
}

export const ReferralProgram: React.FC = () => {
  const [referralEmail, setReferralEmail] = useState('');
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateReferralCode();
    fetchReferrals();
  }, []);

  const generateReferralCode = () => {
    // Generate unique referral code based on user
    const code = `ESTAL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setReferralCode(code);
  };

  const fetchReferrals = async () => {
    try {
      setLoading(true);

      const sessionData = localStorage.getItem('supabase.auth.token');
      const session = sessionData ? JSON.parse(sessionData) : null;
      const accessToken = session?.currentSession?.access_token;

      if (!accessToken) {
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-96250128/referrals`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch referrals');

      const data = await response.json();
      setReferrals(data.referrals || []);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!referralEmail || !referralEmail.includes('@')) {
      toast.error('الرجاء إدخال بريد إلكتروني صحيح');
      return;
    }

    setSubmitting(true);
    try {
      const sessionData = localStorage.getItem('supabase.auth.token');
      const session = sessionData ? JSON.parse(sessionData) : null;
      const accessToken = session?.currentSession?.access_token;

      if (!accessToken) {
        toast.error('الرجاء تسجيل الدخول');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-96250128/referral`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ referredEmail }),
        }
      );

      if (!response.ok) throw new Error('Failed to send referral');

      toast.success('تم إرسال الدعوة بنجاح!');
      setReferralEmail('');
      fetchReferrals();
    } catch (error) {
      toast.error('حدث خطأ في الإرسال');
    } finally {
      setSubmitting(false);
    }
  };

  const copyReferralLink = () => {
    const link = `https://estal.sa/register?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('تم نسخ الرابط!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaEmail = () => {
    const subject = 'انضم إلى منصة Estal لإدارة العقارات';
    const body = `مرحباً،\n\nأدعوك للانضمام إلى منصة Estal - منصة إدارة العقارات الذكية.\n\nاستخدم هذا الرابط للحصول على خصم 20% على الاشتراك:\nhttps://estal.sa/register?ref=${referralCode}\n\nأطيب التحيات`;
    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const rewardsProgress = Math.min((referrals.length / 5) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="rounded-[24px] shadow-xl border-border bg-gradient-to-br from-[#9BAE84]/10 to-transparent">
        <CardContent className="p-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-[#9BAE84] flex items-center justify-center">
                  <Gift className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl">برنامج الإحالة</h2>
                  <p className="text-sm text-muted-foreground">
                    اكسب مكافآت مقابل كل صديق تدعوه
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#9BAE84] mt-0.5" />
                  <div>
                    <p className="font-medium">خصم 20% لك ولصديقك</p>
                    <p className="text-sm text-muted-foreground">
                      على الاشتراك السنوي
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#9BAE84] mt-0.5" />
                  <div>
                    <p className="font-medium">شهر مجاني إضافي</p>
                    <p className="text-sm text-muted-foreground">
                      عند 5 إحالات ناجحة
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#9BAE84] mt-0.5" />
                  <div>
                    <p className="font-medium">ترقية مجانية</p>
                    <p className="text-sm text-muted-foreground">
                      عند 10 إحالات ناجحة
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[20px] p-6 shadow-lg">
              <h3 className="mb-4">كودك الخاص</h3>

              <div className="flex gap-2 mb-4">
                <Input
                  value={`https://estal.sa/register?ref=${referralCode}`}
                  readOnly
                  className="rounded-[12px]"
                />
                <Button
                  onClick={copyReferralLink}
                  variant="outline"
                  className="rounded-[12px] flex-shrink-0"
                >
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={shareViaEmail}
                  variant="outline"
                  className="rounded-[12px]"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  بريد إلكتروني
                </Button>
                <Button
                  onClick={copyReferralLink}
                  variant="outline"
                  className="rounded-[12px]"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  مشاركة
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Send Invite */}
      <Card className="rounded-[24px] shadow-xl border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#9BAE84]" />
            إرسال دعوة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendInvite} className="flex gap-3">
            <Input
              type="email"
              placeholder="أدخل البريد الإلكتروني لصديقك"
              value={referralEmail}
              onChange={(e) => setReferralEmail(e.target.value)}
              className="rounded-[12px]"
              disabled={submitting}
            />
            <Button
              type="submit"
              disabled={submitting}
              className="rounded-[12px] bg-[#9BAE84] hover:bg-[#8a9d75] flex-shrink-0"
            >
              {submitting ? 'جاري الإرسال...' : 'إرسال دعوة'}
              <ArrowRight className="w-4 h-4 mr-2" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card className="rounded-[24px] shadow-xl border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#9BAE84]" />
            تقدمك نحو المكافآت
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">الإحالات الناجحة</span>
                <Badge className="rounded-full bg-[#9BAE84]/10 text-[#9BAE84] border-[#9BAE84]/20">
                  {referrals.filter((r) => r.status === 'activated').length} / 5
                </Badge>
              </div>
              <Progress value={rewardsProgress} className="h-3" />
              <p className="text-xs text-muted-foreground mt-2">
                {5 - referrals.filter((r) => r.status === 'activated').length} إحالات
                متبقية للحصول على شهر مجاني!
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  threshold: 1,
                  reward: 'خصم 20%',
                  icon: Sparkles,
                  achieved: referrals.length >= 1,
                },
                {
                  threshold: 5,
                  reward: 'شهر مجاني',
                  icon: Gift,
                  achieved: referrals.length >= 5,
                },
                {
                  threshold: 10,
                  reward: 'ترقية مجانية',
                  icon: Trophy,
                  achieved: referrals.length >= 10,
                },
              ].map((milestone, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-[16px] border-2 text-center ${
                    milestone.achieved
                      ? 'border-[#9BAE84] bg-[#9BAE84]/5'
                      : 'border-border'
                  }`}
                >
                  <milestone.icon
                    className={`w-8 h-8 mx-auto mb-2 ${
                      milestone.achieved ? 'text-[#9BAE84]' : 'text-muted-foreground'
                    }`}
                  />
                  <div className="font-medium mb-1">{milestone.reward}</div>
                  <div className="text-xs text-muted-foreground">
                    {milestone.threshold} {milestone.threshold === 1 ? 'إحالة' : 'إحالات'}
                  </div>
                  {milestone.achieved && (
                    <Badge className="mt-2 rounded-full bg-green-100 text-green-700 border-green-200">
                      تم الإنجاز!
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referrals List */}
      <Card className="rounded-[24px] shadow-xl border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-[#9BAE84]" />
            إحالاتك ({referrals.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-muted rounded-[12px] animate-pulse"
                />
              ))}
            </div>
          ) : referrals.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">لم تقم بإحالة أحد بعد</p>
              <p className="text-sm text-muted-foreground mt-2">
                ابدأ بدعوة أصدقائك للحصول على المكافآت!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-4 bg-muted rounded-[12px]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#9BAE84]/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-[#9BAE84]" />
                    </div>
                    <div>
                      <p className="text-sm">{referral.referred_email}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(referral.created_at).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>

                  <Badge
                    className={`rounded-full ${
                      referral.status === 'activated'
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : referral.status === 'accepted'
                        ? 'bg-blue-100 text-blue-700 border-blue-200'
                        : 'bg-amber-100 text-amber-700 border-amber-200'
                    }`}
                  >
                    {referral.status === 'activated'
                      ? 'مفعّل'
                      : referral.status === 'accepted'
                      ? 'مقبول'
                      : 'قيد الانتظار'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
