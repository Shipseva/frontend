import { createApi } from "@reduxjs/toolkit/query/react";
import { UserProfile } from "@/types/user";
import { logout, setUser } from "@/store/slices/userSlice";
import { createBaseQueryWithToasts } from "./baseQuery";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: createBaseQueryWithToasts("http://localhost/users"),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUser: builder.query<UserProfile, void>({
      query: () => "get-current-user",
      providesTags: ["User"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('✅ getUser successful:', data);
          dispatch(setUser({ user: data, token: 'cookie' }));
          
          // Check KYC verification status
          if (!data.isVerified) {
            console.log('⚠️ User KYC not verified - showing warning toast');
            // Show KYC warning toast with action buttons
            if (typeof window !== 'undefined') {
              import('@/utils/toast').then(({ showKYCWarningToast }) => {
                showKYCWarningToast();
              });
            }
          }
        } catch (error) {
          console.error('❌ getUser failed:', error);
          dispatch(logout()); // This will handle the redirect
        }
      },
    }),
        logoutUser: builder.mutation<{ message: string }, void>({
          query: () => ({
            url: "logout",
            method: "POST",
          }),
          invalidatesTags: ["User"],
          async onQueryStarted(arg, { dispatch, queryFulfilled }) {
            try {
              await queryFulfilled;
              dispatch(logout());
            } catch {
              dispatch(logout());
            }
          },
        }),
  }),
});

export const { 
  useGetUserQuery,
  useLogoutUserMutation
} = userApi;
