import { ReactFlowProvider } from "@xyflow/react"
import Workflow from "@/components/workflow/WorkflowBuilder";

const App = () => {
  return(
    <ReactFlowProvider>
      <Workflow></Workflow>
    </ReactFlowProvider>
  )

};

export default App;