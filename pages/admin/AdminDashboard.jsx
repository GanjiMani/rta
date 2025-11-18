import { useAuth } from "../../services/AuthContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Shield,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminDashboard() {
  const { user, fetchWithAuth } = useAuth();
  const role = user?.role || localStorage.getItem("role");

  const [stats, setStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [fundFlowData, setFundFlowData] = useState([]);
  const [reconData, setReconData] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetchWithAuth("/admin/admindashboard");
        const data = await res.json();
        setStats(data.stats);
        setRecentActivity(data.recent_activity);
        setFundFlowData(data.fund_flow);
        setReconData(data.reconciliation);
        setSystemAlerts(data.system_alerts);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    }
    fetchDashboard();
  }, [fetchWithAuth]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-blue-700 mb-2">
        {role === "admin" ? "Admin Dashboard" : "AMC Dashboard"}
      </h1>
      <p className="text-gray-600 mb-8">
        {role === "admin"
          ? "Monitor RTA operations, investor activity, and AMC compliance."
          : "Track fund flows, compliance, and reconciliation status."}
      </p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item) => {
          const CardContent = (
            <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4 hover:shadow-lg transition cursor-pointer">
              <item.icon className={`w-10 h-10 ${item.color}`} />
              <div>
                <p className="text-gray-500 text-sm">{item.name}</p>
                <p className="text-xl font-bold">{item.value}</p>
              </div>
            </div>
          );

          return item.link ? (
            <Link key={item.name} to={item.link}>
              {CardContent}
            </Link>
          ) : (
            <div key={item.name}>{CardContent}</div>
          );
        })}
      </div>

      {/* Charts + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Fund Flow Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow col-span-2">
          <h2 className="text-lg font-semibold mb-4">Weekly Fund Flows</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={fundFlowData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="inflow" stroke="#2563eb" />
              <Line type="monotone" dataKey="outflow" stroke="#f43f5e" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Reconciliation Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Reconciliation Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reconData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {reconData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? "#2563eb" : "#f43f5e"} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" /> Recent Activity
          </h2>
          <ul className="space-y-3">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="flex justify-between border-b pb-2 text-sm">
                <span>{activity.action}</span>
                <span className="text-gray-500">{activity.time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* System Alerts */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" /> System Alerts
          </h2>
          <ul className="space-y-3">
            {systemAlerts.slice(0, 3).map((alert) => (
              <li
                key={alert.id}
                className={`p-3 rounded-lg text-sm ${
                  alert.type === "critical"
                    ? "bg-red-50 text-red-700"
                    : "bg-yellow-50 text-yellow-700"
                }`}
              >
                {alert.msg}
              </li>
            ))}
          </ul>
          <Link
            to="/admin/alerts"
            className="text-blue-600 text-sm hover:underline mt-3 inline-block"
          >
            View All Alerts →
          </Link>
        </div>
      </div>
    </div>
  );
}
