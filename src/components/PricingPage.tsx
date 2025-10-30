import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Check,
  X,
  Building2,
  Users,
  TrendingUp,
  Crown,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { toast } from 'sonner@2.0.3';

interface PricingTier {
  name: string;
  nameEn: string;
  price: {
    monthly: number;
    yearly: number;
  };
  description: string;
  features: {
    name: string;
    included: boolean;
    tooltip?: string;
  }[];
  icon: typeof Building2;
  color: string;
  popular?: boolean;
  cta: string;
}

export const PricingPage: React.FC<{ embedded?: boolean }> = ({ embedded = false }) => {
  const [isYearly, setIsYearly] = useState(false);

  const pricingTiers: PricingTier[] = [
    {
      name: 'البداية',
      nameEn: 'Starter',
      price: {
        monthly: 299,
        yearly: 2990, // Save 2 months
      },
      description: 'مثالي لأصحاب العقارات الأفراد',
      icon: Building2,
      color: 'blue',
      cta: 'ابدأ الآن',
      features: [
        { name: 'حتى 10 عقارات', included: true },
        { name: 'مستخدم واحد', included: true },
        { name: 'تقارير مالية أساسية', included: true },
        { name: 'إدارة الصيانة', included: true },
        { name: 'دعم فني عبر البريد', included: true },
        { name: 'تطبيق الجوال', included: true },
        { name: 'نسخ احتياطي يومي', included: true },
        {
          name: 'ذكاء اصطناعي متقدم',
          included: false,
          tooltip: 'متوفر في الباقات الأعلى',
        },
        { name: 'تكامل مع الأنظمة الخارجية', included: false },
        { name: 'تقارير مخصصة', included: false },
        { name: 'مدير حساب مخصص', included: false },
      ],
    },
    {
      name: 'الأعمال',
      nameEn: 'Business',
      price: {
        monthly: 799,
        yearly: 7990, // Save 2 months
      },
      description: 'للشركات والمحافظ المتوسطة',
      icon: Users,
      color: 'green',
      popular: true,
      cta: 'الأكثر شعبية',
      features: [
        { name: 'حتى 50 عقار', included: true },
        { name: 'حتى 5 مستخدمين', included: true },
        { name: 'تقارير مالية متقدمة', included: true },
        { name: 'إدارة الصيانة + التنبيهات', included: true },
        { name: 'دعم فني عبر الهاتف', included: true },
        { name: 'تطبيق الجوال + الويب', included: true },
        { name: 'نسخ احتياطي كل ساعة', included: true },
        {
          name: 'ذكاء اصطناعي متقدم',
          included: true,
          tooltip: 'تحليلات تنبؤية ونصائح ذكية',
        },
        {
          name: 'تكامل مع الأنظمة الخارجية',
          included: true,
          tooltip: 'API متاح',
        },
        { name: 'تقارير مخصصة', included: true },
        { name: 'مدير حساب مخصص', included: false },
      ],
    },
    {
      name: 'المؤسسات',
      nameEn: 'Enterprise',
      price: {
        monthly: 0, // Custom pricing
        yearly: 0,
      },
      description: 'للمؤسسات الكبيرة والمحافظ الضخمة',
      icon: Crown,
      color: 'purple',
      cta: 'تواصل معنا',
      features: [
        { name: 'عدد غير محدود من العقارات', included: true },
        { name: 'عدد غير محدود من المستخدمين', included: true },
        { name: 'تقارير مالية مخصصة بالكامل', included: true },
        { name: 'إدارة صيانة متقدمة + SLA', included: true },
        { name: 'دعم فني متميز 24/7', included: true },
        { name: 'جميع التطبيقات + White Label', included: true },
        { name: 'نسخ احتياطي فوري', included: true },
        {
          name: 'ذكاء اصطناعي متقدم + تدريب مخصص',
          included: true,
          tooltip: 'نماذج AI مخصصة لأعمالك',
        },
        {
          name: 'تكامل كامل + تطوير مخصص',
          included: true,
          tooltip: 'حلول مخصصة حسب الطلب',
        },
        { name: 'تقارير وتحليلات مخصصة', included: true },
        {
          name: 'مدير حساب مخصص + استشارات',
          included: true,
          tooltip: 'دعم استراتيجي كامل',
        },
      ],
    },
  ];

  const handleSelectPlan = (tier: PricingTier) => {
    if (tier.nameEn === 'Enterprise') {
      // Scroll to contact or open contact modal
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        toast.info('يرجى التواصل معنا للحصول على عرض سعر مخصص');
      }
    } else {
      toast.success(`تم اختيار باقة ${tier.name}!`);
      // Redirect to signup with plan
      setTimeout(() => {
        window.location.href = `/register?plan=${tier.nameEn.toLowerCase()}&billing=${
          isYearly ? 'yearly' : 'monthly'
        }`;
      }, 1000);
    }
  };

  const container = embedded ? 'div' : 'section';
  const Container = container as keyof JSX.IntrinsicElements;

  return (
    <Container
      id="pricing"
      className={embedded ? '' : 'py-20 bg-[#F5F5F1]'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 rounded-full">الأسعار</Badge>
          <h2 className="text-4xl mb-4">خطط مصممة لكل نوع من الأعمال</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            ابدأ مجاناً لمدة 30 يوم، ثم اختر الباقة المناسبة لك
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={!isYearly ? 'font-semibold' : 'text-muted-foreground'}>
              شهري
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={isYearly ? 'font-semibold' : 'text-muted-foreground'}>
              سنوي
            </span>
            {isYearly && (
              <Badge className="rounded-full bg-green-100 text-green-700 border-green-200">
                وفر 17%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.nameEn}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="rounded-full bg-[#9BAE84] text-white px-4 py-1">
                    <Sparkles className="w-4 h-4 mr-1" />
                    الأكثر اختياراً
                  </Badge>
                </div>
              )}

              <Card
                className={`rounded-[24px] shadow-xl border-2 h-full ${
                  tier.popular
                    ? 'border-[#9BAE84] shadow-2xl scale-105'
                    : 'border-border'
                }`}
              >
                <CardHeader className="p-8 pb-6">
                  <div
                    className={`w-14 h-14 rounded-[16px] bg-${tier.color}-100 flex items-center justify-center mb-4`}
                  >
                    <tier.icon className={`w-7 h-7 text-${tier.color}-600`} />
                  </div>
                  <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
                  <p className="text-muted-foreground text-sm mb-6">{tier.description}</p>

                  {tier.price.monthly === 0 ? (
                    <div>
                      <div className="text-4xl mb-2">حسب الطلب</div>
                      <div className="text-sm text-muted-foreground">
                        سعر مخصص حسب احتياجاتك
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl">
                          {isYearly ? tier.price.yearly : tier.price.monthly}
                        </span>
                        <span className="text-xl text-muted-foreground">ريال</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        / {isYearly ? 'سنوياً' : 'شهرياً'}
                      </div>
                      {isYearly && (
                        <div className="text-sm text-green-600 mt-1">
                          وفر {(tier.price.monthly * 12 - tier.price.yearly).toLocaleString()}{' '}
                          ريال
                        </div>
                      )}
                    </div>
                  )}
                </CardHeader>

                <CardContent className="p-8 pt-0">
                  <Button
                    onClick={() => handleSelectPlan(tier)}
                    className={`w-full rounded-[12px] mb-6 ${
                      tier.popular
                        ? 'bg-[#9BAE84] hover:bg-[#8a9d75]'
                        : 'bg-background hover:bg-muted border border-border'
                    }`}
                    variant={tier.popular ? 'default' : 'outline'}
                    size="lg"
                  >
                    {tier.cta}
                    <ArrowRight className="w-5 h-5 mr-2" />
                  </Button>

                  <div className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <TooltipProvider key={i}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-start gap-3">
                              {feature.included ? (
                                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                              ) : (
                                <X className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                              )}
                              <div className="flex items-center gap-2 flex-1">
                                <span
                                  className={
                                    feature.included
                                      ? 'text-sm'
                                      : 'text-sm text-muted-foreground line-through'
                                  }
                                >
                                  {feature.name}
                                </span>
                                {feature.tooltip && (
                                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                          </TooltipTrigger>
                          {feature.tooltip && (
                            <TooltipContent>
                              <p className="text-sm">{feature.tooltip}</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <Card className="rounded-[24px] shadow-xl border-border overflow-hidden">
          <CardHeader className="p-8 bg-muted/50">
            <CardTitle className="text-2xl text-center">مقارنة شاملة بين الباقات</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-6 text-right">الميزة</th>
                    {pricingTiers.map((tier) => (
                      <th key={tier.nameEn} className="p-6 text-center">
                        {tier.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    'عدد العقارات',
                    'عدد المستخدمين',
                    'التقارير المالية',
                    'إدارة الصيانة',
                    'الدعم الفني',
                    'التطبيقات',
                    'النسخ الاحتياطي',
                    'الذكاء الاصطناعي',
                    'التكامل',
                    'التقارير المخصصة',
                    'مدير الحساب',
                  ].map((feature, i) => (
                    <tr key={i} className="border-b border-border hover:bg-muted/30">
                      <td className="p-6">{feature}</td>
                      {pricingTiers.map((tier) => (
                        <td key={tier.nameEn} className="p-6 text-center">
                          {tier.features[i].included ? (
                            <Check className="w-5 h-5 text-green-600 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-muted-foreground mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl mb-4">أسئلة شائعة</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: 'هل يمكنني تغيير الباقة لاحقاً؟',
                a: 'نعم، يمكنك الترقية أو التخفيض في أي وقت. سيتم احتساب الفرق بشكل تناسبي.',
              },
              {
                q: 'هل البيانات محمية؟',
                a: 'نعم، نستخدم تشفير من مستوى البنوك ونسخ احتياطي يومي لحماية بياناتك.',
              },
              {
                q: 'هل هناك التزام طويل الأجل؟',
                a: 'لا، جميع الباقات بدون التزام. يمكنك الإلغاء في أي وقت.',
              },
              {
                q: 'هل يوجد خصم للدفع السنوي؟',
                a: 'نعم، احصل على خصم 17% عند الدفع السنوي (شهرين مجاناً).',
              },
            ].map((faq, i) => (
              <Card key={i} className="rounded-[16px] shadow-lg border-border text-right">
                <CardContent className="p-6">
                  <h4 className="mb-2">{faq.q}</h4>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};
