import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, Shield, AlertTriangle } from "lucide-react";

export default function TermsOfUsePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Badge variant="secondary" className="w-fit">
          Legal
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">Terms of Use</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Last updated: October 9, 2025
        </p>
        <p className="text-muted-foreground">
          These Terms of Use govern your use of the EcoShare platform. By accessing or using our services,
          you agree to be bound by these terms and our Privacy Policy.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-primary" />
              <CardTitle>Acceptance of Terms</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              By creating an account, accessing, or using EcoShare, you acknowledge that you have read,
              understood, and agree to be bound by these Terms of Use and our Privacy Policy.
            </p>
            <p className="text-muted-foreground">
              If you do not agree to these terms, please do not use our platform. We reserve the right
              to modify these terms at any time, with changes taking effect immediately upon posting.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-primary" />
              <CardTitle>User Accounts & Eligibility</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Account Requirements</h4>
              <ul className="text-muted-foreground space-y-1 ml-4">
                <li>• You must be at least 18 years old to use EcoShare</li>
                <li>• Provide accurate and complete registration information</li>
                <li>• Maintain the security and confidentiality of your account</li>
                <li>• Notify us immediately of any unauthorized use</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Account Types</h4>
              <ul className="text-muted-foreground space-y-1 ml-4">
                <li>• <strong>Generators:</strong> Individuals or businesses providing compostable materials</li>
                <li>• <strong>Receivers:</strong> Farmers, gardeners, or organizations seeking compost materials</li>
                <li>• You may maintain both types of accounts if applicable</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-primary" />
              <CardTitle>Platform Usage & Conduct</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-600">Permitted Use</h4>
              <ul className="text-muted-foreground space-y-1 ml-4">
                <li>• Create and manage compost listings</li>
                <li>• Communicate with verified users</li>
                <li>• Arrange and complete material exchanges</li>
                <li>• Access platform features and resources</li>
                <li>• Provide feedback and participate in community discussions</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-red-600">Prohibited Activities</h4>
              <ul className="text-muted-foreground space-y-1 ml-4">
                <li>• Posting false, misleading, or inappropriate content</li>
                <li>• Engaging in fraudulent or deceptive practices</li>
                <li>• Violating intellectual property rights</li>
                <li>• Harassing, threatening, or abusing other users</li>
                <li>• Attempting to circumvent platform fees or restrictions</li>
                <li>• Using automated tools or bots without permission</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content & Materials</CardTitle>
            <CardDescription>
              Guidelines for listing and exchanging compostable materials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Material Standards</h4>
              <p className="text-muted-foreground">
                All materials listed on EcoShare must be compostable organic waste suitable for agricultural use.
                Prohibited materials include hazardous waste, non-organic materials, and items that could contaminate soil.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Content Ownership</h4>
              <p className="text-muted-foreground">
                You retain ownership of content you post to EcoShare. By posting content, you grant us a
                non-exclusive, royalty-free license to use, display, and distribute your content on our platform.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Quality Assurance</h4>
              <p className="text-muted-foreground">
                Users are responsible for the accuracy of their listings and the quality of materials provided.
                EcoShare is not liable for material quality disputes between users.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transactions & Payments</CardTitle>
            <CardDescription>
              How exchanges and payments work on EcoShare
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Service Fees</h4>
              <p className="text-muted-foreground">
                EcoShare charges a service fee for successful transactions. Fees vary by account type and
                transaction volume. Current fee structure is available in your account settings.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Payment Processing</h4>
              <p className="text-muted-foreground">
                Payments are processed securely through third-party providers (Stripe). EcoShare does not
                store payment information. All transactions are final once completed.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Disputes</h4>
              <p className="text-muted-foreground">
                Users must resolve transaction disputes directly. EcoShare may mediate disputes at our
                discretion but is not obligated to provide refunds or resolve conflicts.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-primary" />
              <CardTitle>Termination & Suspension</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              EcoShare reserves the right to suspend or terminate accounts that violate these terms,
              engage in prohibited activities, or pose a risk to our platform or community.
            </p>
            <div className="space-y-3">
              <h4 className="font-semibold">Account Termination Process</h4>
              <ul className="text-muted-foreground space-y-1 ml-4">
                <li>• We may suspend accounts pending investigation</li>
                <li>• Permanent termination may result from serious violations</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Disclaimers & Limitations</CardTitle>
            <CardDescription>
              Important legal disclaimers about using EcoShare
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              EcoShare provides a platform for connecting users but does not guarantee transaction success
              or material quality. Users engage in exchanges at their own risk.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Service Availability</h4>
                <p className="text-muted-foreground text-sm">
                  We strive for high availability but cannot guarantee uninterrupted service.
                  Maintenance windows and outages may occur.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Third-Party Services</h4>
                <p className="text-muted-foreground text-sm">
                  Our platform integrates with third-party services. We are not responsible
                  for their performance or policies.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <FileText className="h-8 w-8 text-blue-600 mx-auto" />
              <h3 className="text-lg font-semibold">Contact Us</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                If you have questions about these Terms of Use or need clarification on any policies,
                please contact our support team.
              </p>
              <div className="flex justify-center space-x-4 text-sm">
                <span>📧 legal@ecoshare.ph</span>
                <span>📍 Cebu City, Philippines</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
