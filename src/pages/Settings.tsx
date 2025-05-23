
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  
  // General settings
  const [companyName, setCompanyName] = useState("Inventory Pro");
  const [companyEmail, setCompanyEmail] = useState("support@inventorypro.com");
  const [taxRate, setTaxRate] = useState("8.50");
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [stockAlerts, setStockAlerts] = useState(true);
  const [invoiceReminders, setInvoiceReminders] = useState(true);
  
  // Backup settings
  const [backupFrequency, setBackupFrequency] = useState("weekly");
  
  const handleGeneralSave = () => {
    // In a real app, would save to backend
    toast({
      title: "Settings saved",
      description: "Your general settings have been updated successfully."
    });
  };
  
  const handleNotificationSave = () => {
    toast({
      title: "Notification preferences saved",
      description: "Your notification settings have been updated successfully."
    });
  };
  
  const handleBackupNow = () => {
    toast({
      title: "Backup initiated",
      description: "Your data backup has been started. This may take a few minutes."
    });
  };
  
  const handleExportData = () => {
    toast({
      title: "Data exported",
      description: "Your inventory data has been exported successfully."
    });
  };
  
  return (
    <MainLayout requireAdmin>
      <div className="flex flex-col space-y-1.5 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage application preferences and configurations
        </p>
      </div>
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="backup">Backup & Export</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>
                Configure your business information and application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyEmail">Business Email</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  This tax rate will be applied to all invoices by default
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleGeneralSave}>Save Changes</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Currency and Number Format</CardTitle>
              <CardDescription>
                Set how monetary values and numbers are displayed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency Symbol</Label>
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input id="currency" defaultValue="$" className="w-16" />
                  <Input id="currencyCode" defaultValue="USD" className="w-20" />
                  <Button>Apply</Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Decimal Places</Label>
                  <Input id="decimalPlaces" type="number" min="0" max="4" defaultValue="2" />
                </div>
                
                <div className="space-y-2">
                  <Label>Thousand Separator</Label>
                  <Input id="thousandSeparator" defaultValue="," />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleGeneralSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure when and how you'd like to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications" className="block mb-1">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive important notifications via email
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="stockAlerts" className="block mb-1">Low Stock Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when products fall below their threshold
                  </p>
                </div>
                <Switch
                  id="stockAlerts"
                  checked={stockAlerts}
                  onCheckedChange={setStockAlerts}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="invoiceReminders" className="block mb-1">Invoice Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Send automatic reminders for unpaid invoices
                  </p>
                </div>
                <Switch
                  id="invoiceReminders"
                  checked={invoiceReminders}
                  onCheckedChange={setInvoiceReminders}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleNotificationSave}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automated Backups</CardTitle>
              <CardDescription>
                Configure automatic backups of your inventory data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="backupFrequency">Backup Frequency</Label>
                <select
                  id="backupFrequency"
                  className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  value={backupFrequency}
                  onChange={(e) => setBackupFrequency(e.target.value)}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
              
              <div>
                <Label className="mb-2 block">Manual Backup</Label>
                <Button onClick={handleBackupNow}>Backup Now</Button>
                <p className="mt-2 text-sm text-muted-foreground">
                  Create an immediate backup of all your data
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
              <CardDescription>
                Export your inventory and sales data in various formats
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-4">
                <Button onClick={handleExportData}>Export Inventory (CSV)</Button>
                <Button onClick={handleExportData} variant="outline">Export Sales Data (Excel)</Button>
                <Button onClick={handleExportData} variant="outline">Export Customer List (CSV)</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage users who can access your inventory system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left">User</th>
                        <th className="px-4 py-3 text-left">Role</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="px-4 py-3">Admin User</td>
                        <td className="px-4 py-3">Admin</td>
                        <td className="px-4 py-3">admin@example.com</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-600">Active</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="px-4 py-3">Cashier User</td>
                        <td className="px-4 py-3">Cashier</td>
                        <td className="px-4 py-3">cashier@example.com</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-600">Active</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <Button>Add New User</Button>
                
                <div className="text-sm text-muted-foreground">
                  <p>Note: In this demo version, user management is limited. In a full version, you would be able to:</p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Add new users with specific roles</li>
                    <li>Set permissions for each role</li>
                    <li>Manage user accounts and access rights</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
