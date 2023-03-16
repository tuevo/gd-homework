import { BackendProvider } from "@gooddata/sdk-ui";
import "./i18n/config";
import AppRouter from "./routes/AppRouter";
import { useAuth } from "./contexts/Auth";
import { WorkspaceListProvider } from "./contexts/WorkspaceList";

function App() {
    const { backend } = useAuth();

    return (
        <BackendProvider backend={backend}>
            <WorkspaceListProvider>
                <AppRouter />
            </WorkspaceListProvider>
        </BackendProvider>
    );
}

export default App;
