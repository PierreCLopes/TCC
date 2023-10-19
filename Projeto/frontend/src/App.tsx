import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { AppThemeProvider } from "./shared/contexts/ThemeContext";
import { Login, MenuLateral } from "./shared/components";
import { AuthProvider, DrawerProvider } from "./shared/contexts";

export const App = () => {
  return (
    <AuthProvider>
      <AppThemeProvider> 
        <Login>
          <DrawerProvider>
            <BrowserRouter>
              <MenuLateral>
                <AppRoutes/>
              </MenuLateral>
            </BrowserRouter>
          </DrawerProvider>
        </Login>
      </AppThemeProvider>
    </AuthProvider>
  );
};