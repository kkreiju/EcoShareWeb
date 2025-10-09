import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail,
  MessageSquare,
  Phone,
  MapPin,
  Clock,
  Send,
  HelpCircle,
  AlertCircle,
  CheckCircle
} from "lucide-react";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us a detailed message and we'll respond within 24 hours",
    contact: "ecoshare.admn@gmail.com",
    response: "Within 24 hours",
    available: "24/7",
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Get instant help from our support team during business hours",
    contact: "Available in-app",
    response: "Instant",
    available: "Mon-Fri, 9AM-5PM PST",
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Speak directly with our team for urgent matters",
    contact: "+63 (32) 123-4567",
    response: "Immediate",
    available: "Mon-Fri, 9AM-5PM PST",
  },
];

const offices = [
  {
    city: "Cebu City",
    address: "123 Sustainable Street, Business District, Cebu City 6000, Philippines",
    phone: "+63 (32) 123-4567",
    email: "hello@ecoshare.ph",
  },
  {
    city: "Manila",
    address: "456 Eco Avenue, Green District, Makati City 1220, Philippines",
    phone: "+63 (2) 987-6543",
    email: "manila@ecoshare.ph",
  },
];

export default function ContactUsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Badge variant="secondary" className="w-fit">
          Contact Us
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">Get in Touch</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Have a question, need help, or want to share feedback? We're here to help.
          Choose the best way to reach us below.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {contactMethods.map((method, index) => (
          <Card key={index} className="text-center hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <method.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{method.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{method.description}</p>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{method.contact}</p>
                <div className="flex items-center justify-center space-x-4 text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{method.available}</span>
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-1 text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  <span>{method.response}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Send us a Message</CardTitle>
          <CardDescription>
            Fill out the form below and we'll get back to you as soon as possible
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="Enter your first name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Enter your last name" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="Enter your email address" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="What's this about?" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Select a category</option>
              <option value="account">Account Issues</option>
              <option value="technical">Technical Support</option>
              <option value="billing">Billing & Payments</option>
              <option value="partnership">Partnership Inquiries</option>
              <option value="feedback">Feedback & Suggestions</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Tell us how we can help you..."
              className="min-h-[120px]"
            />
          </div>
          <Button className="w-full">
            <Send className="mr-2 h-4 w-4" />
            Send Message
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Our Offices</CardTitle>
            <CardDescription>
              Visit us at one of our locations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {offices.map((office, index) => (
              <div key={index} className="space-y-3">
                <h4 className="font-semibold flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  {office.city}
                </h4>
                <div className="text-muted-foreground text-sm space-y-1 ml-6">
                  <p>{office.address}</p>
                  <p>📞 {office.phone}</p>
                  <p>📧 {office.email}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>
              Quick answers to common questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <HelpCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-medium">How do I create an account?</h5>
                  <p className="text-muted-foreground text-sm">
                    Click "Get Started" and follow the registration process.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <HelpCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-medium">Is EcoShare free to use?</h5>
                  <p className="text-muted-foreground text-sm">
                    Basic features are free. Premium features have associated costs.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <HelpCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-medium">How do I report an issue?</h5>
                  <p className="text-muted-foreground text-sm">
                    Use the contact form above or email ecoshare.admn@gmail.com
                  </p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              View All FAQs
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <AlertCircle className="h-8 w-8 text-primary mx-auto" />
            <h3 className="text-lg font-semibold">Emergency Support</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              For urgent safety concerns or platform emergencies, please contact us immediately
              using the phone number above or send an email marked "URGENT" to ecoshare.admn@gmail.com
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
