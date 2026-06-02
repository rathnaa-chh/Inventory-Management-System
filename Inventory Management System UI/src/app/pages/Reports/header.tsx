import { Download, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/button';

interface ReportHeaderProps {
  onExport: () => void;
  onRefresh: () => void;
  loading?: boolean;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({ onExport, onRefresh, loading = false }) => (
  <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-8 text-white">
    <div className="flex items-center justify-between mb-2">
      <div>
        <h1 className="text-4xl font-bold mb-2">Reports & Analytics</h1>
        <p className="text-slate-300">Comprehensive inventory analysis and real-time insights</p>
      </div>
      <div className="flex gap-3">
        <Button
          onClick={onRefresh}
          variant="outline"
          className="gap-2"
          disabled={loading}
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
        <Button onClick={onExport} className="gap-2 bg-white text-slate-900 hover:bg-slate-100">
          <Download className="w-4 h-4" />
          Export PDF
        </Button>
      </div>
    </div>
  </div>
);
