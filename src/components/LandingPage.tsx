import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Building2,
  TrendingUp,
  Shield,
  Users,
  BarChart3,
  Clock,
  CheckCircle2,
  ArrowRight,
  Play,
  Star,
  Globe,
  Zap,
  Mail,
  Phone,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { projectId } from '../utils/supabase/info';

export const LandingPage: React.FC = () => {
  const [betaEmail, setBetaEmail] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleBetaRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!betaEmail || !betaEmail.includes('@')) {
      toast.error('الرجاء إدخال بريد إلكتروني صحيح');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-96250128/beta-access`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: betaEmail }),
        }
      );

      if (!response.ok) throw new Error('Request failed');

      toast.success('تم إرسال طلبك بنجاح! سنتواصل معك قريباً');
      setBetaEmail('');
    } catch (error) {
      toast.error('حدث خطأ في الإرسال، يرجى المحاولة مرة أخرى');
    } finally {
      setSubmitting(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-96250128/contact`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contactForm),
        }
      );

      if (!response.ok) throw new Error('Request failed');

      toast.success('تم إرسال رسالتك بنجاح!');
      setContactForm({ name: '', email: '', company: '', phone: '', message: '' });
    } catch (error) {
      toast.error('حدث خطأ في الإرسال، يرجى المحاولة مرة أخرى');
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F1]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-lg border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Building2 className="w-8 h-8 text-[#9BAE84]" />
              <span className="text-2xl font-bold">Estal</span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => scrollToSection('features')}
                className="text-sm hover:text-[#9BAE84] transition-colors"
              >
                المميزات
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-sm hover:text-[#9BAE84] transition-colors"
              >
                الأسعار
              </button>
              <button
                onClick={() => scrollToSection('demo')}
                className="text-sm hover:text-[#9BAE84] transition-colors"
              >
                عرض تجريبي
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-sm hover:text-[#9BAE84] transition-colors"
              >
                تواصل معنا
              </button>
              <Button
                onClick={() => (window.location.href = '/login')}
                variant="outline"
                size="sm"
                className="rounded-[12px]"
              >
                تسجيل الدخول
              </Button>
              <Button
                onClick={() => scrollToSection('beta')}
                size="sm"
                className="rounded-[12px] bg-[#9BAE84] hover:bg-[#8a9d75]"
              >
                انضم للنسخة التجريبية
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 rounded-full bg-[#9BAE84]/10 text-[#9BAE84] border-[#9BAE84]/20">
                <Star className="w-3 h-3 mr-1 fill-[#9BAE84]" />
                منصة إدارة العقارات الأولى في السعودية
              </Badge>

              <h1 className="text-5xl lg:text-6xl mb-6 leading-tight">
                إدارة عقارية ذكية
                <br />
                <span className="text-[#9BAE84]">بتقنية الذكاء الاصطناعي</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                منصة Estal توفر لك كل ما تحتاجه لإدارة محفظتك العقارية بكفاءة عالية.
                تتبع الإيرادات، إدارة الصيانة، وتحليلات مالية متقدمة في مكان واحد.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  onClick={() => scrollToSection('beta')}
                  className="rounded-[16px] bg-[#9BAE84] hover:bg-[#8a9d75] text-lg h-14 px-8"
                >
                  ابدأ تجربتك المجانية
                  <ArrowRight className="w-5 h-5 mr-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection('demo')}
                  className="rounded-[16px] text-lg h-14 px-8"
                >
                  <Play className="w-5 h-5 ml-2" />
                  شاهد العرض التوضيحي
                </Button>
              </div>

              <div className="flex items-center gap-8">
                <div>
                  <div className="text-3xl mb-1">500+</div>
                  <div className="text-sm text-muted-foreground">عقار مُدار</div>
                </div>
                <div>
                  <div className="text-3xl mb-1">95%</div>
                  <div className="text-sm text-muted-foreground">رضا العملاء</div>
                </div>
                <div>
                  <div className="text-3xl mb-1">24/7</div>
                  <div className="text-sm text-muted-foreground">دعم فني</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <Card className="rounded-[24px] shadow-2xl border-border overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-[#9BAE84]/20 to-[#9BAE84]/5 p-8 aspect-video flex items-center justify-center">
                    <div className="text-center">
                      <Building2 className="w-24 h-24 text-[#9BAE84] mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        لوحة تحكم Estal - إدارة متكاملة لعقاراتك
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-4 -left-4 bg-white rounded-[20px] shadow-xl p-4 border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">الإيرادات الشهرية</div>
                    <div className="text-xl">+24% ↑</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 rounded-full">المميزات الرئيسية</Badge>
            <h2 className="text-4xl mb-4">كل ما تحتاجه لإدارة عقارية ناجحة</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              منصة متكاملة مصممة خصيصاً لتلبية احتياجات مُلاك العقارات والمحاسبين
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: 'تحليلات مالية متقدمة',
                description: 'تقارير شاملة عن الإيرادات والمصروفات مع رسوم بيانية تفاعلية',
                color: 'blue',
              },
              {
                icon: Shield,
                title: 'أمان على مستوى البنوك',
                description: 'حماية متقدمة لبياناتك مع تشفير كامل ونسخ احتياطي تلقائي',
                color: 'green',
              },
              {
                icon: Users,
                title: 'إدارة متعددة المستخدمين',
                description: 'صلاحيات مخصصة لكل مستخدم (مالك، محاسب، مدير)',
                color: 'purple',
              },
              {
                icon: Clock,
                title: 'تتبع الصيانة',
                description: 'إدارة طلبات الصيانة مع تنبيهات تلقائية ومتابعة الحالة',
                color: 'orange',
              },
              {
                icon: Zap,
                title: 'ذكاء اصطناعي',
                description: 'توقعات ذكية ونصائح تحسين الأداء بناءً على بياناتك',
                color: 'pink',
              },
              {
                icon: Globe,
                title: 'دعم اللغة العربية',
                description: 'واجهة مصممة بالكامل للغة العربية مع دعم التقويم الهجري',
                color: 'teal',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="rounded-[20px] shadow-lg border-border h-full hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div
                      className={`w-14 h-14 rounded-[16px] bg-${feature.color}-100 flex items-center justify-center mb-4`}
                    >
                      <feature.icon className={`w-7 h-7 text-${feature.color}-600`} />
                    </div>
                    <h3 className="text-xl mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section id="demo" className="py-20 bg-[#F5F5F1]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 rounded-full">عرض توضيحي</Badge>
            <h2 className="text-4xl mb-4">شاهد Estal في العمل</h2>
            <p className="text-xl text-muted-foreground">
              جولة سريعة في المنصة (60 ثانية)
            </p>
          </div>

          <Card className="rounded-[24px] shadow-2xl border-border overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-video bg-gradient-to-br from-[#9BAE84]/30 to-[#9BAE84]/10 flex items-center justify-center">
                <Button
                  size="lg"
                  className="rounded-full w-20 h-20 bg-white hover:bg-gray-100"
                  onClick={() => toast.info('الفيديو قيد الإنتاج - سيتوفر قريباً!')}
                >
                  <Play className="w-8 h-8 text-[#9BAE84]" />
                </Button>
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                  60 ثانية
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { label: 'إعداد سريع', value: '< 5 دقائق' },
              { label: 'سهولة الاستخدام', value: '95%' },
              { label: 'وقت التدريب', value: '< 1 ساعة' },
            ].map((stat, i) => (
              <Card key={i} className="rounded-[16px] shadow-lg border-border text-center">
                <CardContent className="p-6">
                  <div className="text-3xl text-[#9BAE84] mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Beta Access Section */}
      <section id="beta" className="py-20 bg-gradient-to-br from-[#9BAE84] to-[#8a9d75]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 rounded-full bg-white/20 text-white border-white/30">
            النسخة التجريبية Beta
          </Badge>
          <h2 className="text-4xl text-white mb-4">
            انضم إلى 500+ مالك عقار في النسخة التجريبية
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            احصل على وصول مبكر لجميع المميزات مع خصم 50% على الاشتراك السنوي
          </p>

          <form onSubmit={handleBetaRequest} className="max-w-md mx-auto">
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={betaEmail}
                onChange={(e) => setBetaEmail(e.target.value)}
                className="rounded-[12px] bg-white h-14 text-lg"
                disabled={submitting}
              />
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="rounded-[12px] bg-white text-[#9BAE84] hover:bg-gray-100 h-14 px-8"
              >
                {submitting ? 'جاري الإرسال...' : 'انضم الآن'}
              </Button>
            </div>
          </form>

          <div className="flex items-center justify-center gap-8 mt-12 text-white">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>تجربة مجانية 30 يوم</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>بدون بطاقة ائتمانية</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>دعم فني مجاني</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 rounded-full">تواصل معنا</Badge>
            <h2 className="text-4xl mb-4">هل لديك استفسار؟</h2>
            <p className="text-xl text-muted-foreground">
              فريقنا جاهز للإجابة على جميع أسئلتك
            </p>
          </div>

          <Card className="rounded-[24px] shadow-xl border-border">
            <CardContent className="p-8">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm mb-2">الاسم *</label>
                    <Input
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, name: e.target.value })
                      }
                      className="rounded-[12px]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">البريد الإلكتروني *</label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, email: e.target.value })
                      }
                      className="rounded-[12px]"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm mb-2">الشركة</label>
                    <Input
                      value={contactForm.company}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, company: e.target.value })
                      }
                      className="rounded-[12px]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">رقم الهاتف</label>
                    <Input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, phone: e.target.value })
                      }
                      className="rounded-[12px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">الرسالة *</label>
                  <Textarea
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, message: e.target.value })
                    }
                    className="rounded-[12px] min-h-[120px]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={submitting}
                  className="w-full rounded-[12px] bg-[#9BAE84] hover:bg-[#8a9d75]"
                >
                  {submitting ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                </Button>
              </form>

              <div className="grid md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-border">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#9BAE84] mt-1" />
                  <div>
                    <div className="text-sm mb-1">البريد الإلكتروني</div>
                    <a
                      href="mailto:support@estal.sa"
                      className="text-muted-foreground hover:text-[#9BAE84]"
                    >
                      support@estal.sa
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#9BAE84] mt-1" />
                  <div>
                    <div className="text-sm mb-1">الهاتف</div>
                    <a
                      href="tel:+966500000000"
                      className="text-muted-foreground hover:text-[#9BAE84]"
                    >
                      +966 50 000 0000
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-8 h-8 text-[#9BAE84]" />
                <span className="text-2xl font-bold">Estal</span>
              </div>
              <p className="text-gray-400">
                منصة إدارة العقارات الذكية المصممة خصيصاً للسوق السعودي
              </p>
            </div>

            <div>
              <h4 className="mb-4">المنتج</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#features" className="hover:text-[#9BAE84]">
                    المميزات
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-[#9BAE84]">
                    الأسعار
                  </a>
                </li>
                <li>
                  <a href="#demo" className="hover:text-[#9BAE84]">
                    عرض تجريبي
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4">الشركة</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-[#9BAE84]">
                    عن Estal
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-[#9BAE84]">
                    تواصل معنا
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#9BAE84]">
                    الوظائف
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4">القانونية</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-[#9BAE84]">
                    الشروط والأحكام
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#9BAE84]">
                    سياسة الخصوصية
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 Estal. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
