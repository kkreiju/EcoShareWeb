'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Package, DollarSign, Users, Eye, Heart } from 'lucide-react'

export function ListingStats() {
  const stats = [
    {
      title: 'Total Listings',
      value: '1,247',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Package,
      description: 'Available items'
    },
    {
      title: 'Total Value',
      value: '$45,230',
      change: '+8%',
      changeType: 'positive' as const,
      icon: DollarSign,
      description: 'Market value'
    },
    {
      title: 'Active Users',
      value: '892',
      change: '+23%',
      changeType: 'positive' as const,
      icon: Users,
      description: 'This month'
    },
    {
      title: 'Total Views',
      value: '12.5K',
      change: '+18%',
      changeType: 'positive' as const,
      icon: Eye,
      description: 'Last 30 days'
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </div>
                <Badge
                  variant={stat.changeType === 'positive' ? 'default' : 'destructive'}
                  className="ml-2"
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.change}
                </Badge>
              </div>
            </CardContent>
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 pointer-events-none" />
          </Card>
        )
      })}
    </div>
  )
}
