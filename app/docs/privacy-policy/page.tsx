import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, Lock, Database } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Badge variant="secondary" className="w-fit">
          Legal
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Last updated: October 9, 2025
        </p>
        <p className="text-muted-foreground">
          EcoShare is committed to protecting your privacy and ensuring the security of your personal information.
          This Privacy Policy explains how we collect, use, and safeguard your data.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-primary" />
              <CardTitle>Information We Collect</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Personal Information</h4>
              <ul className="text-muted-foreground space-y-1 ml-4">
                <li>• Name, email address, and phone number</li>
                <li>• Profile information and preferences</li>
                <li>• Location data for matching services</li>
                <li>• Payment information (processed securely by third parties)</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Usage Data</h4>
              <ul className="text-muted-foreground space-y-1 ml-4">
                <li>• How you interact with our platform</li>
                <li>• Device information and browser data</li>
                <li>• IP addresses and location information</li>
                <li>• Cookies and similar tracking technologies</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Eye className="h-6 w-6 text-primary" />
              <CardTitle>How We Use Your Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Core Services</h4>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• Matching generators with receivers</li>
                  <li>• Facilitating communications</li>
                  <li>• Processing transactions</li>
                  <li>• Providing customer support</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Platform Improvement</h4>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• Analyzing usage patterns</li>
                  <li>• Improving our algorithms</li>
                  <li>• Developing new features</li>
                  <li>• Ensuring platform security</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Database className="h-6 w-6 text-primary" />
              <CardTitle>Data Sharing & Third Parties</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We do not sell your personal information to third parties. We may share data only in the following circumstances:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-semibold text-green-600">We Share With</h4>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• Other verified EcoShare users (for matching)</li>
                  <li>• Payment processors (Stripe, for transactions)</li>
                  <li>• Email service providers (for notifications)</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-red-600">We Don't Share With</h4>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• Advertisers or marketing companies</li>
                  <li>• Social media platforms</li>
                  <li>• Data brokers or resellers</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Lock className="h-6 w-6 text-primary" />
              <CardTitle>Data Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We implement industry-standard security measures to protect your data:
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="text-center p-3 rounded-lg border">
                <h5 className="font-semibold text-sm">Encryption</h5>
                <p className="text-muted-foreground text-xs mt-1">
                  Data encrypted in transit and at rest
                </p>
              </div>
              <div className="text-center p-3 rounded-lg border">
                <h5 className="font-semibold text-sm">Access Control</h5>
                <p className="text-muted-foreground text-xs mt-1">
                  Strict access controls and monitoring
                </p>
              </div>
              <div className="text-center p-3 rounded-lg border">
                <h5 className="font-semibold text-sm">Regular Audits</h5>
                <p className="text-muted-foreground text-xs mt-1">
                  Security assessments and updates
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Rights & Choices</CardTitle>
            <CardDescription>
              You have control over your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Your Rights Include</h4>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• Access your personal data</li>
                  <li>• Correct inaccurate information</li>
                  <li>• Delete your account and data</li>
                  <li>• Opt out of marketing communications</li>
                  <li>• Data portability</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Contact Us</h4>
                <p className="text-muted-foreground text-sm mb-3">
                  To exercise these rights or ask questions about your privacy:
                </p>
                <div className="space-y-1 text-sm">
                  <p>📧 privacy@ecoshare.ph</p>
                  <p>📍 Cebu City, Philippines</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Shield className="h-8 w-8 text-amber-600 mx-auto" />
              <h3 className="text-lg font-semibold">Updates to This Policy</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We may update this Privacy Policy occasionally. We'll notify you of significant changes
                via email or platform notification. Your continued use of EcoShare after changes take effect
                constitutes acceptance of the updated policy.
              </p>
              <p className="text-sm text-muted-foreground">
                Last updated: October 9, 2025
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
