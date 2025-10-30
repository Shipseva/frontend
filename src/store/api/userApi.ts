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
          
          // Show KYC warning only when explicitly rejected
          const kycStatus = (data as any).status; // optional from backend
          const shouldShowKycWarning = kycStatus === 'rejected';

          if (shouldShowKycWarning) {
            console.log('⚠️ User KYC rejected - showing warning toast');
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
