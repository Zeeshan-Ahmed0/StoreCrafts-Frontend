import { AnalyticsCard } from '@/components/common/AnalyticsCard';
import { DataTable, Column } from '@/components/common/DataTable';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/types/index';
import { formatDate } from '@/lib/utils';

// Mock analytics data - Replace with API call when ready
const mockAnalytics = {
  totalRevenue: 45250,
  totalOrders: 234,
  totalProducts: 89,
  totalCustomers: 1245,
  totalReviews: 456,
  revenueGrowth: 12.5,
  orderGrowth: 8.2,
  recentOrders: [
    {
      id: '1',
      orderNumber: 'ORD-001',
      customerId: 'cust-1',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      totalAmount: 250,
      itemCount: 3,
      status: 'shipped' as const,
      paymentStatus: 'paid' as const,
      shippingAddress: '123 Main St',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ] as Order[],
  topProducts: [],
};

const orderColumns: Column<Order>[] = [
  { key: 'orderNumber', label: 'Order #' },
  { key: 'customerName', label: 'Customer' },
  { key: 'totalAmount', label: 'Amount', render: (val) => `$${val}` },
  { key: 'status', label: 'Status' },
  {
    key: 'createdAt',
    label: 'Date',
    render: (val) => formatDate(val),
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your store admin panel</p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Total Revenue"
          value={`$${mockAnalytics.totalRevenue.toLocaleString()}`}
          change={mockAnalytics.revenueGrowth}
          icon={<DollarSign size={20} />}
          trend="up"
        />
        <AnalyticsCard
          title="Total Orders"
          value={mockAnalytics.totalOrders}
          change={mockAnalytics.orderGrowth}
          icon={<ShoppingCart size={20} />}
          trend="up"
        />
        <AnalyticsCard
          title="Products"
          value={mockAnalytics.totalProducts}
          icon={<Package size={20} />}
        />
        <AnalyticsCard
          title="Customers"
          value={mockAnalytics.totalCustomers}
          icon={<Users size={20} />}
        />
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={mockAnalytics.recentOrders}
            columns={orderColumns}
            searchableFields={['customerName', 'orderNumber']}
            pageSize={5}
          />
        </CardContent>
      </Card>
    </div>
  );
}