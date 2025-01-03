"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRight, Linkedin, Users, BarChart2 } from 'lucide-react';

// Natural Language Query Component
const QueryInput = ({ value, onChange }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Natural Language Query</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          className="w-full"
          placeholder="e.g., Show me LinkedIn performance for enterprise customers"
          value={value}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};

// Workflow Node Component
const WorkflowNode = ({ icon: Icon, label }) => {
  return (
    <div className="flex items-center justify-center p-3 bg-blue-100 rounded-lg min-w-32 transition-colors hover:bg-blue-200">
      <Icon className="w-5 h-5 mr-2" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};

// Node Connector Component
const NodeConnector = () => {
  return <ArrowRight className="w-5 h-5 text-gray-400" />;
};

// Visual Workflow Component
const VisualWorkflow = ({ nodes }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Visual Workflow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 overflow-x-auto p-2">
          {nodes.map((node, index) => (
            <React.Fragment key={index}>
              <WorkflowNode icon={node.icon} label={node.label} />
              {index < nodes.length - 1 && <NodeConnector />}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Metric Card Component
const MetricCard = ({ label, value, unit = '%' }) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-2xl font-bold">
        {value}
        {unit}
      </div>
    </div>
  );
};

// Results Preview Component
const ResultsPreview = ({ metrics }) => {
  if (!metrics) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Results Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <MetricCard
            label="Engagement Rate"
            value={metrics.engagementRate}
          />
          <MetricCard
            label="Click-Through Rate"
            value={metrics.clickThroughRate}
          />
        </div>
      </CardContent>
    </Card>
  );
};

// Workflow Parser Utility
const workflowParser = {
  parseQuery: (query) => {
    const input = query.toLowerCase();
    const nodes = [];
    
    if (input.includes('linkedin')) {
      nodes.push({ type: 'source', label: 'LinkedIn Data', icon: Linkedin });
    }
    
    if (input.includes('enterprise')) {
      nodes.push({ type: 'filter', label: 'Enterprise Filter', icon: Users });
    } else if (input.includes('mid-market')) {
      nodes.push({ type: 'filter', label: 'Mid-Market Filter', icon: Users });
    }
    
    if (input.includes('performance') || input.includes('show me')) {
      nodes.push({ type: 'analysis', label: 'Performance Analysis', icon: BarChart2 });
    }

    return nodes;
  },

  generateMetrics: (nodes) => {
    if (nodes.length === 0) return null;
    
    return {
      engagementRate: Math.round(Math.random() * 5 + 2),
      clickThroughRate: Math.round(Math.random() * 3 + 1),
    };
  }
};

// Main Workflow Builder Component
const WorkflowBuilder = () => {
  const [query, setQuery] = useState('');
  const [nodes, setNodes] = useState([]);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const newNodes = workflowParser.parseQuery(query);
    setNodes(newNodes);
    setMetrics(workflowParser.generateMetrics(newNodes));
  }, [query]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <QueryInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <VisualWorkflow nodes={nodes} />
      </div>
      <ResultsPreview metrics={metrics} />
    </div>
  );
};

export default WorkflowBuilder;


