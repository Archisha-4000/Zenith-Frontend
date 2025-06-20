"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Link, Shield, CheckCircle, Clock, Search, ExternalLink, Copy, Download, Zap } from "lucide-react"

export function BlockchainLedger() {
  const blockchainMetrics = {
    totalTransactions: 1247,
    verifiedTransactions: 1223,
    pendingVerifications: 24,
    smartContractsActive: 8,
    gasUsed: "2.4 ETH",
    networkStatus: "Healthy",
  }

  const transactions = [
    {
      id: 1,
      hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
      type: "Task Assignment",
      employee: "Alice Johnson",
      project: "DeFi Protocol V2",
      amount: null,
      timestamp: "2024-01-22 14:30:25",
      status: "Confirmed",
      blockNumber: 18945672,
      gasUsed: "0.0021 ETH",
      confirmations: 127,
    },
    {
      id: 2,
      hash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234",
      type: "Payment",
      employee: "Bob Smith",
      project: "Mobile Wallet",
      amount: 6200,
      timestamp: "2024-01-22 13:45:18",
      status: "Confirmed",
      blockNumber: 18945658,
      gasUsed: "0.0034 ETH",
      confirmations: 141,
    },
    {
      id: 3,
      hash: "0x3c4d5e6f7890abcdef1234567890abcdef123456",
      type: "Milestone Completion",
      employee: "Carol Davis",
      project: "Security Audit",
      amount: null,
      timestamp: "2024-01-22 12:15:42",
      status: "Pending",
      blockNumber: null,
      gasUsed: null,
      confirmations: 0,
    },
    {
      id: 4,
      hash: "0x4d5e6f7890abcdef1234567890abcdef12345678",
      type: "Smart Contract Deploy",
      employee: "System",
      project: "Core Infrastructure",
      amount: null,
      timestamp: "2024-01-22 11:20:15",
      status: "Confirmed",
      blockNumber: 18945621,
      gasUsed: "0.0156 ETH",
      confirmations: 178,
    },
  ]

  const smartContracts = [
    {
      name: "TaskAssignment",
      address: "0xA1B2C3D4E5F6789012345678901234567890ABCD",
      status: "Active",
      deployedAt: "2024-01-15",
      interactions: 247,
      gasUsed: "1.2 ETH",
    },
    {
      name: "PaymentProcessor",
      address: "0xB2C3D4E5F6789012345678901234567890ABCDEF",
      status: "Active",
      deployedAt: "2024-01-10",
      interactions: 156,
      gasUsed: "0.8 ETH",
    },
    {
      name: "EmployeeRegistry",
      address: "0xC3D4E5F6789012345678901234567890ABCDEF12",
      status: "Active",
      deployedAt: "2024-01-08",
      interactions: 89,
      gasUsed: "0.4 ETH",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-900/50 text-green-400 border-green-600"
      case "Pending":
        return "bg-yellow-900/50 text-yellow-400 border-yellow-600"
      case "Failed":
        return "bg-red-900/50 text-red-400 border-rose-800"
      default:
        return "bg-gray-900/50 text-gray-400 border-gray-600"
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Blockchain Ledger</h1>
          <p className="text-zinc-400 mt-1">Immutable record of all organizational transactions and activities</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-zinc-700 border-zinc-600 text-white hover:bg-zinc-600">
            <Download className="w-4 h-4 mr-2" />
            Export Ledger
          </Button>
          <Button className="bg-rose-800 hover:bg-red-700 text-white">
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Explorer
          </Button>
        </div>
      </div>

      {/* Blockchain Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Transactions</CardTitle>
            <Link className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{blockchainMetrics.totalTransactions}</div>
            <p className="text-xs text-zinc-400">
              <span className="text-green-400">{blockchainMetrics.verifiedTransactions} verified</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Pending Verifications</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{blockchainMetrics.pendingVerifications}</div>
            <p className="text-xs text-zinc-400">
              <span className="text-yellow-400">Awaiting confirmation</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Smart Contracts</CardTitle>
            <Shield className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{blockchainMetrics.smartContractsActive}</div>
            <p className="text-xs text-zinc-400">
              <span className="text-green-400">All active</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Gas Used</CardTitle>
            <Zap className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{blockchainMetrics.gasUsed}</div>
            <p className="text-xs text-zinc-400">
              <span className="text-blue-400">This month</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Search */}
      <Card className="bg-zinc-800 border-zinc-700">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <Input
              placeholder="Search by transaction hash, employee, or project..."
              className="pl-10 bg-zinc-700 border-zinc-600 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white">Transaction History</CardTitle>
          <CardContent className="text-zinc-400">
            Chronological record of all blockchain transactions
          </CardContent>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-700">
                <TableHead className="text-zinc-400">Transaction Hash</TableHead>
                <TableHead className="text-zinc-400">Employee</TableHead>
                <TableHead className="text-zinc-400">Project</TableHead>
                <TableHead className="text-zinc-400">Amount</TableHead>
                <TableHead className="text-zinc-400">Status</TableHead>
                <TableHead className="text-zinc-400">Block</TableHead>
                <TableHead className="text-zinc-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id} className="border-zinc-700">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-blue-400 bg-zinc-700 px-2 py-1 rounded">
                        {tx.hash.substring(0, 10)}...{tx.hash.substring(tx.hash.length - 8)}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-zinc-400 hover:text-white"
                        onClick={() => copyToClipboard(tx.hash)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-white">{tx.employee}</TableCell>
                  <TableCell className="text-zinc-300">{tx.project}</TableCell>
                  <TableCell className="text-white">{tx.amount ? `$${tx.amount.toLocaleString()}` : "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(tx.status)}>
                      {tx.status === "Confirmed" && <CheckCircle className="w-3 h-3 mr-1" />}
                      {tx.status === "Pending" && <Clock className="w-3 h-3 mr-1" />}
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {tx.blockNumber ? (
                      <div className="space-y-1">
                        <div className="text-sm">#{tx.blockNumber}</div>
                        <div className="text-xs text-zinc-400">{tx.confirmations} confirmations</div>
                      </div>
                    ) : (
                      <span className="text-zinc-400">Pending</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Smart Contracts */}
      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            Smart Contracts
          </CardTitle>
          <CardContent className="text-zinc-400">
            Deployed smart contracts and their interaction statistics
          </CardContent>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {smartContracts.map((contract, index) => (
              <div key={index} className="p-4 rounded-lg bg-zinc-700/50 border border-zinc-600">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-white">{contract.name}</h4>
                    <p className="text-xs text-zinc-400">Deployed {contract.deployedAt}</p>
                  </div>
                  <Badge variant="outline" className="bg-green-900/50 text-green-400 border-green-600">
                    {contract.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Address</span>
                    <div className="flex items-center gap-1">
                      <code className="text-xs text-blue-400 bg-zinc-700 px-1 py-0.5 rounded">
                        {contract.address.substring(0, 6)}...{contract.address.substring(contract.address.length - 4)}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 text-zinc-400 hover:text-white"
                        onClick={() => copyToClipboard(contract.address)}
                      >
                        <Copy className="h-2 w-2" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Interactions</span>
                    <span className="text-white">{contract.interactions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Gas Used</span>
                    <span className="text-white">{contract.gasUsed}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 bg-zinc-600 border-zinc-500 text-white hover:bg-zinc-600"
                >
                  <ExternalLink className="w-3 h-3 mr-2" />
                  View Contract
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
