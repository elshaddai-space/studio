import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, BarChart2, ShieldCheck, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center bg-background text-foreground">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-gradient-to-br from-primary via-indigo-600 to-purple-600 text-primary-foreground text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-6">
            Empower Your Finances with FinPlatform
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            A revolutionary platform providing seamless financial tools, smart analytics, and effortless business onboarding.
          </p>
          <Link href="/onboarding">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
              Onboard Your Business
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-headline font-semibold text-center mb-12 text-primary">
            Why Choose FinPlatform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Briefcase className="h-10 w-10 text-primary" />}
              title="Effortless Onboarding"
              description="Get your business set up in minutes with our intuitive chat-based onboarding process."
            />
            <FeatureCard
              icon={<BarChart2 className="h-10 w-10 text-primary" />}
              title="Smart Analytics"
              description="Gain valuable insights into your financial performance with our advanced analytics tools."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-10 w-10 text-primary" />}
              title="Secure & Reliable"
              description="Your data is protected with bank-grade security and robust infrastructure."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-headline font-semibold text-center mb-12 text-primary">
            Streamlined Process
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <div className="md:w-1/2">
              <Image
                src="https://placehold.co/600x400.png"
                alt="Financial Dashboard"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
                data-ai-hint="finance dashboard"
              />
            </div>
            <div className="md:w-1/2 space-y-6">
              <StepItem number="1" title="Quick Chat Onboarding" description="Answer a few simple questions via our smart chat interface to provide your business details." />
              <StepItem number="2" title="Instant Verification" description="Our system verifies your information in real-time to ensure accuracy and compliance." />
              <StepItem number="3" title="Access Your Dashboard" description="Once onboarded, gain access to a powerful suite of financial tools and insights tailored for your business." />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-20 md:py-32 text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-headline font-semibold mb-6 text-primary">
            Ready to Transform Your Business Finances?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-xl mx-auto text-muted-foreground">
            Join thousands of businesses already benefiting from FinPlatform.
          </p>
          <Link href="/onboarding">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-10 py-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden">
      <CardHeader className="items-center text-center bg-card p-6">
        <div className="p-4 bg-primary/10 rounded-full mb-4">
          {icon}
        </div>
        <CardTitle className="font-headline text-2xl text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center p-6">
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

interface StepItemProps {
  number: string;
  title: string;
  description: string;
}

function StepItem({number, title, description}: StepItemProps) {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-headline font-semibold text-primary">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
