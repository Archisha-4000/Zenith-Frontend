import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Clock, CheckCircle, AlertCircle, MoreHorizontal, Send, FileText, Shield, TrendingUp } from "lucide-react"

export function PaymentsPanel() {
  const paymentMetrics = {
    totalPending: 47230,
    totalPaid: 156780,
    thisMonth: 23450,
    pendingCount: 12,
  }

  const pendingPayments = [
    {
      id: 1,
      employee: "Alice Johnson",
      amount: 8500,
      type: "Milestone",
      project: "DeFi Protocol V2",
      dueDate: "2024-01-25",
      tasksCompleted: 8,
      blockchainVerified: true,
      status: "Ready",
    },
    {
      id: 2,
      employee: "Bob Smith",
      amount: 6200,
      type: "Monthly",
      project: "Mobile Wallet",
      dueDate: "2024-01-30",
      tasksCompleted: 12,
      blockchainVerified: true,
      status: "Ready",
    },
    {
      id: 3,
      employee: "Carol Davis",
      amount: 12000,
      type: "Bonus",
      project: "Security Audit",
      dueDate: "2024-01-28",
      tasksCompleted: 15,
      blockchainVerified: false,
      status: "Pending Verification",
    },
    {
      id: 4,
      employee: "David Wilson",
      amount: 4500,
      type: "Task-based",
      project: "API Gateway",
      dueDate: "2024-02-01",
      tasksCompleted: 6,
      blockchainVerified: true,
      status: "Ready",
    },
  ]

  const recentTransactions = [
    {
      id: "tx_001",
      employee: "Alice Johnson",
      amount: 7500,
      date: "2024-01-20",
      status: "Completed",
      blockchainHash: "0x1a2b3c4d...",
      type: "Milestone",
    },
    {
      id: "tx_002",
      employee: "Bob Smith",
      amount: 5800,
      date: "2024-01-18",
      status: "Completed",
      blockchainHash: "0x5e6f7g8h...",
      type: "Monthly",
    },
    {
      id: "tx_003",
      employee: "Carol Davis",
      amount: 3200,
      date: "2024-01-15",
      status: "Failed",
      blockchainHash: null,
      type: "Task-based",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ready":
        return "bg-green-900/50 text-green-400 border-green-600"
      case "Pending Verification":
        return "bg-yellow-900/50 text-yellow-400 border-yellow-600"
      case "Completed":
        return "bg-blue-900/50 text-blue-400 border-blue-600"
      case "Failed":
        return "bg-red-900/50 text-red-400 border-red-800"
      default:
        return "bg-gray-900/50 text-gray-400 border-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Payments & Invoices</h1>
          <p className="text-zinc-400 mt-1">Manage blockchain-verified payments and employee compensation</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-zinc-700 border-zinc-600 text-white hover:bg-zinc-600">
            <FileText className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-red-800 hover:bg-red-700 text-white">
            <Send className="w-4 h-4 mr-2" />
            Bulk Payment
          </Button>
        </div>
      </div>

      {/* Payment Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${paymentMetrics.totalPending.toLocaleString()}</div>
            <p className="text-xs text-zinc-400">
              <span className="text-yellow-400">{paymentMetrics.pendingCount} payments</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${paymentMetrics.totalPaid.toLocaleString()}</div>
            <p className="text-xs text-zinc-400">
              <span className="text-green-400">This year</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${paymentMetrics.thisMonth.toLocaleString()}</div>
            <p className="text-xs text-zinc-400">
              <span className="text-green-400">+15%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Blockchain Status</CardTitle>
            <Shield className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">98.5%</div>
            <p className="text-xs text-zinc-400">
              <span className="text-green-400">Verification rate</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Payments */}
      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white">Pending Payments</CardTitle>
          <CardContent className="text-zinc-400">
            Payments awaiting approval and blockchain verification
          </CardContent>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-700">
                <TableHead className="text-zinc-400">Employee</TableHead>
                <TableHead className="text-zinc-400">Amount</TableHead>
                <TableHead className="text-zinc-400">Type</TableHead>
                <TableHead className="text-zinc-400">Project</TableHead>
                <TableHead className="text-zinc-400">Due Date</TableHead>
                <TableHead className="text-zinc-400">Status</TableHead>
                <TableHead className="text-zinc-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingPayments.map((payment) => (
                <TableRow key={payment.id} className="border-zinc-700">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{payment.employee}</span>
                      {payment.blockchainVerified && <Shield className="w-4 h-4 text-green-400" />}
                    </div>
                  </TableCell>
                  <TableCell className="text-white font-medium">${payment.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-zinc-700 text-zinc-300 border-zinc-600">
                      {payment.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-300">{payment.project}</TableCell>
                  <TableCell className="text-zinc-300">{payment.dueDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(payment.status)}>
                      {payment.status === "Ready" && <CheckCircle className="w-3 h-3 mr-1" />}
                      {payment.status === "Pending Verification" && <Clock className="w-3 h-3 mr-1" />}
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-white">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-zinc-700 border-zinc-600">
                        <DropdownMenuItem className="text-zinc-300 hover:bg-zinc-600">
                          <Send className="w-4 h-4 mr-2" />
                          Process Payment
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-zinc-300 hover:bg-zinc-600">
                          <FileText className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-zinc-300 hover:bg-zinc-600">
                          <Shield className="w-4 h-4 mr-2" />
                          Verify Blockchain
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 hover:bg-red-900/50">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Reject Payment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Transactions</CardTitle>
          <CardContent className="text-zinc-400">
            Latest payment transactions with blockchain verification
          </CardContent>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-700">
                <TableHead className="text-zinc-400">Transaction ID</TableHead>
                <TableHead className="text-zinc-400">Employee</TableHead>
                <TableHead className="text-zinc-400">Amount</TableHead>
                <TableHead className="text-zinc-400">Date</TableHead>
                <TableHead className="text-zinc-400">Type</TableHead>
                <TableHead className="text-zinc-400">Status</TableHead>
                <TableHead className="text-zinc-400">Blockchain Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="border-zinc-700">
                  <TableCell className="text-zinc-300 font-mono text-sm">{transaction.id}</TableCell>
                  <TableCell className="text-white">{transaction.employee}</TableCell>
                  <TableCell className="text-white font-medium">${transaction.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-zinc-300">{transaction.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-zinc-700 text-zinc-300 border-zinc-600">
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(transaction.status)}>
                      {transaction.status === "Completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                      {transaction.status === "Failed" && <AlertCircle className="w-3 h-3 mr-1" />}
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {transaction.blockchainHash ? (
                      <code className="text-xs text-blue-400 bg-zinc-700 px-2 py-1 rounded">
                        {transaction.blockchainHash}
                      </code>
                    ) : (
                      <span className="text-zinc-400 text-xs">N/A</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
