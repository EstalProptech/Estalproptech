import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  MessageSquare,
  Star,
  ThumbsUp,
  ThumbsDown,
  Send,
  CheckCircle2,
  Lightbulb,
  Bug,
  Smile,
  Meh,
  Frown,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface FeedbackFormProps {
  onClose?: () => void;
  embedded?: boolean;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ onClose, embedded = false }) => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [feedback, setFeedback] = useState({
    // Step 1: Type
    type: 'feature' as 'feature' | 'bug' | 'improvement' | 'other',

    // Step 2: Rating
    nps: 0,
    satisfaction: 'neutral' as 'happy' | 'neutral' | 'unhappy',

    // Step 3: Details
    title: '',
    description: '',
    category: '',

    // Step 4: Contact
    name: '',
    email: '',
    allowContact: true,
  });

  const handleNPSClick = (score: number) => {
    setFeedback({ ...feedback, nps: score });
  };

  const handleSubmit = async () => {
    if (!feedback.title || !feedback.description) {
      toast.error('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    setSubmitting(true);
    try {
      // Get user session if available
      const sessionData = localStorage.getItem('supabase.auth.token');
      const session = sessionData ? JSON.parse(sessionData) : null;
      const accessToken = session?.currentSession?.access_token || publicAnonKey;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-96250128/feedback`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            ...feedback,
            submitted_at: new Date().toISOString(),
            user_agent: navigator.userAgent,
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to submit feedback');

      setSubmitted(true);
      toast.success('شكراً لك! تم إرسال ملاحظاتك بنجاح');

      // Close after 3 seconds if callback provided
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('حدث خطأ في الإرسال، يرجى المحاولة مرة أخرى');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="rounded-[24px] shadow-xl border-border max-w-2xl mx-auto">
        <CardContent className="p-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          </motion.div>

          <h3 className="text-2xl mb-4">شكراً لملاحظاتك القيّمة!</h3>
          <p className="text-muted-foreground mb-6">
            نحن نقدر وقتك وسنعمل على تحسين Estal بناءً على اقتراحاتك
          </p>

          {feedback.allowContact && (
            <Badge className="rounded-full bg-blue-100 text-blue-700 border-blue-200">
              سنتواصل معك قريباً على {feedback.email}
            </Badge>
          )}

          {onClose && (
            <Button
              onClick={onClose}
              variant="outline"
              className="mt-6 rounded-[12px]"
            >
              إغلاق
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-[24px] shadow-xl border-border max-w-2xl mx-auto">
      <CardHeader className="p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#9BAE84]/10 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-[#9BAE84]" />
            </div>
            <div>
              <CardTitle className="text-2xl">شاركنا رأيك</CardTitle>
              <p className="text-sm text-muted-foreground">
                ساعدنا في تحسين Estal
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full ${
                  s <= step ? 'bg-[#9BAE84]' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8 pt-0">
        {/* Step 1: Type */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg mb-4">ما نوع ملاحظتك؟</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'feature', label: 'ميزة جديدة', icon: Lightbulb },
                  { value: 'bug', label: 'مشكلة تقنية', icon: Bug },
                  { value: 'improvement', label: 'تحسين', icon: ThumbsUp },
                  { value: 'other', label: 'أخرى', icon: MessageSquare },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setFeedback({ ...feedback, type: value as any })}
                    className={`p-6 rounded-[16px] border-2 transition-all text-right ${
                      feedback.type === value
                        ? 'border-[#9BAE84] bg-[#9BAE84]/5'
                        : 'border-border hover:border-[#9BAE84]/50'
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 mb-3 ${
                        feedback.type === value ? 'text-[#9BAE84]' : 'text-muted-foreground'
                      }`}
                    />
                    <div className="font-medium">{label}</div>
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setStep(2)}
              className="w-full rounded-[12px] bg-[#9BAE84] hover:bg-[#8a9d75]"
            >
              التالي
            </Button>
          </motion.div>
        )}

        {/* Step 2: NPS & Satisfaction */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-lg mb-2">
                ما مدى احتمالية أن توصي بـ Estal لصديق؟
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                0 = غير محتمل، 10 = محتمل جداً
              </p>
              <div className="flex gap-2 justify-between">
                {Array.from({ length: 11 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handleNPSClick(i)}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      feedback.nps === i
                        ? 'border-[#9BAE84] bg-[#9BAE84] text-white'
                        : 'border-border hover:border-[#9BAE84]/50'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg mb-4">كيف تشعر حيال تجربتك؟</h3>
              <div className="flex gap-4 justify-center">
                {[
                  { value: 'happy', icon: Smile, color: 'green' },
                  { value: 'neutral', icon: Meh, color: 'yellow' },
                  { value: 'unhappy', icon: Frown, color: 'red' },
                ].map(({ value, icon: Icon, color }) => (
                  <button
                    key={value}
                    onClick={() =>
                      setFeedback({ ...feedback, satisfaction: value as any })
                    }
                    className={`p-6 rounded-[16px] border-2 transition-all ${
                      feedback.satisfaction === value
                        ? `border-${color}-500 bg-${color}-50`
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <Icon
                      className={`w-12 h-12 ${
                        feedback.satisfaction === value
                          ? `text-${color}-600`
                          : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1 rounded-[12px]"
              >
                السابق
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="flex-1 rounded-[12px] bg-[#9BAE84] hover:bg-[#8a9d75]"
                disabled={feedback.nps === 0}
              >
                التالي
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Details */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm mb-2">القسم</label>
              <Select
                value={feedback.category}
                onValueChange={(value) => setFeedback({ ...feedback, category: value })}
              >
                <SelectTrigger className="rounded-[12px]">
                  <SelectValue placeholder="اختر القسم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dashboard">لوحة التحكم</SelectItem>
                  <SelectItem value="properties">إدارة العقارات</SelectItem>
                  <SelectItem value="financials">التقارير المالية</SelectItem>
                  <SelectItem value="maintenance">الصيانة</SelectItem>
                  <SelectItem value="users">إدارة المستخدمين</SelectItem>
                  <SelectItem value="mobile">تطبيق الجوال</SelectItem>
                  <SelectItem value="other">أخرى</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm mb-2">العنوان *</label>
              <Input
                value={feedback.title}
                onChange={(e) => setFeedback({ ...feedback, title: e.target.value })}
                placeholder="عنوان مختصر لملاحظتك"
                className="rounded-[12px]"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">التفاصيل *</label>
              <Textarea
                value={feedback.description}
                onChange={(e) =>
                  setFeedback({ ...feedback, description: e.target.value })
                }
                placeholder="اشرح ملاحظتك بالتفصيل..."
                className="rounded-[12px] min-h-[120px]"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(2)}
                variant="outline"
                className="flex-1 rounded-[12px]"
              >
                السابق
              </Button>
              <Button
                onClick={() => setStep(4)}
                className="flex-1 rounded-[12px] bg-[#9BAE84] hover:bg-[#8a9d75]"
                disabled={!feedback.title || !feedback.description}
              >
                التالي
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Contact */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg mb-4">معلومات الاتصال (اختياري)</h3>
              <p className="text-sm text-muted-foreground mb-6">
                إذا كنت ترغب في أن نتواصل معك بخصوص ملاحظتك
              </p>
            </div>

            <div>
              <label className="block text-sm mb-2">الاسم</label>
              <Input
                value={feedback.name}
                onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
                placeholder="اسمك"
                className="rounded-[12px]"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">البريد الإلكتروني</label>
              <Input
                type="email"
                value={feedback.email}
                onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
                placeholder="email@example.com"
                className="rounded-[12px]"
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted rounded-[12px]">
              <input
                type="checkbox"
                id="allowContact"
                checked={feedback.allowContact}
                onChange={(e) =>
                  setFeedback({ ...feedback, allowContact: e.target.checked })
                }
                className="w-4 h-4 rounded border-border"
              />
              <label htmlFor="allowContact" className="text-sm cursor-pointer">
                أوافق على أن يتواصل معي فريق Estal بخصوص هذه الملاحظة
              </label>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(3)}
                variant="outline"
                className="flex-1 rounded-[12px]"
                disabled={submitting}
              >
                السابق
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 rounded-[12px] bg-[#9BAE84] hover:bg-[#8a9d75]"
                disabled={submitting}
              >
                {submitting ? (
                  'جاري الإرسال...'
                ) : (
                  <>
                    <Send className="w-4 h-4 ml-2" />
                    إرسال
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
