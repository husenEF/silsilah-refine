import { AuthProvider } from "@refinedev/core";

const authProvider  = ():AuthProvider=> {
    const login= async ({  email }:{email:string}) => {
     console.log({email});
     

      if (email) {
        localStorage.setItem("email", email);
        return {
          success: true,
          redirectTo: "/",
        };
      }

      return {
        success: false,
        error: {
          message: "Login failed",
          name: "Invalid email or password",
        }

      };
    }

    const register= async ({ email, password }:{email:string,password:string}) => {
      if (email && password) {
        localStorage.setItem("email", email);
        return {
          success: true,
          redirectTo: "/",
        };
      }
      return {
        success: false,
        error: {
          message: "Register failed",
          name: "Invalid email or password",
        }

      };
    }

    const updatePassword= async ({ password }:{password:string}) => {
      if (password) {
        //we can update password here
        return {
          success: true,
          redirectTo: "/login",
        };
      }
      return {
        success: false,
        error: {
          message: "Update password failed",
          name: "Invalid password",
        }

      };
    }

    const forgotPassword= async ({ email }:{email:string}) => {
      if (email) {
        //we can send email with forgot password link here
        return {
          success: true,
          redirectTo: "/login",
        };
      }
      return {
        success: false,
        error: {
          message: "Forgot password failed",
          name: "Invalid email",
        }

      };
    }

    const logout= async () => {
      localStorage.removeItem("email");
      return {
        success: true,
        redirectTo: "/",
      };
    }

    const onError= async (error) => {
      if (error?.response?.status === 401) {
        return {
          logout: true,
        };
      }

      return { error };
    }

    const check= async () => {
      return localStorage.getItem("email")
        ? { authenticated: true }
        : {
            authenticated: false,
            redirectTo: "/login",
            error: {
              message: "Check failed",
              name: "Not authenticated",
            }

          };
    }

    const getPermissions= async () => ["admin"]
    const getIdentity= async () => ({
      id: 1,
      name: "Jane Doe",
      avatar:
        "https://unsplash.com/photos/IWLOvomUmWU/download?force=true&w=640",
    })

    return {
      login,
      register,
      updatePassword,
      forgotPassword,
      logout,
      onError,
      check,
      getPermissions,
      getIdentity,
    }
  };
  export default authProvider;