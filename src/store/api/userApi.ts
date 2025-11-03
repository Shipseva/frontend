import { createApi } from "@reduxjs/toolkit/query/react";
import { UserProfile } from "@/types/user";
import { logout, setUser } from "@/store/slices/userSlice";
import { createBaseQueryWithToasts } from "./baseQuery";
import { getApiUrl } from "@/config/apiConfig";

export enum Status {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: createBaseQueryWithToasts(getApiUrl("USERS")),
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
          
          // Show KYC warning for pending or rejected status
          const kycStatus = (data as any).status as Status | undefined; // optional from backend
          const shouldShowKycWarning = kycStatus === Status.PENDING || kycStatus === Status.REJECTED;

          if (shouldShowKycWarning) {
            console.log(`⚠️ User KYC ${kycStatus} - showing warning toast`);
            if (typeof window !== 'undefined') {
              import('@/utils/toast').then(({ showKYCWarningToast }) => {
                showKYCWarningToast(kycStatus === Status.PENDING ? 'pending' : 'rejected');
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
