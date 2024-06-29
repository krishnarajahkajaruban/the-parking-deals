import api from "../api";

export const sendVerificationEmail = async (email, setLoading, setReSendLoading, setPage, setSeconds, setIsButtonDisabled, setResetPasswordInfo, setSignUpInfo, toast, resetPassword = false) => {
    if (!email) {
        toast?.current.show({
            severity: 'error',
            summary: 'Error in Submission.',
            detail: 'Please fill the required fields!.',
            life: 3000
        });
        return false;
    }
    setLoading(true);
    setReSendLoading(true);
    try {
        const endpoint = resetPassword ? "/api/user/request-reset-password-code" : "/api/user/request-verify-code";
        const response = await api.post(endpoint, { email });
        console.log(response.data);
        if(response.data?.emailSent){
            setPage(2);
            setSeconds(60);
            setIsButtonDisabled(true);
            toast?.current.show({
                severity: 'success',
                summary: 'Email sent successfully.',
                detail: 'Please check your email.',
                life: 3000
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return true;
        } else {
            toast?.current.show({
                severity: 'error',
                summary: 'Email sent failed!',
                detail: 'Please re-verify!',
                life: 3000
            });
            resetPassword ? setResetPasswordInfo(prev => ({ ...prev, email: "" })) : setSignUpInfo(prev => ({ ...prev, email: "" }));
            return false;
        }
    } catch (err) {
        console.log(err);
        toast?.current.show({
            severity: 'error',
            summary: 'Email sent failed!',
            detail: err.response?.data.error,
            life: 3000
        });
        resetPassword ? setResetPasswordInfo(prev => ({ ...prev, email: "" })) : setSignUpInfo(prev => ({ ...prev, email: "" }));
        return false;
    } finally {
        setLoading(false);
        setReSendLoading(false);
    }
};

export const verifyOTP = async (otp, setOTP, email, setLoading, setPage, toast, resetPassword = false) => {
    if (!otp) {
        toast?.current.show({
            severity: 'error',
            summary: 'Error in Submission.',
            detail: 'Please fill the required fields!.',
            life: 3000
        });
        return false;
    }
    setLoading(true);
    try {
        const endpoint = resetPassword ? "/api/user/verify-password-reset" : "/api/user/verify-email";
        const response = await api.post(endpoint, { verificationCode: otp, email });
        console.log(response.data);
        setPage(3);
        toast?.current.show({
            severity: 'success',
            summary: 'OTP verified successfully.',
            detail: resetPassword ? 'You can reset your password' : 'Please register with your account.',
            life: 3000
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return true;
    } catch (err) {
        console.log(err);
        toast.current.show({
            severity: 'error',
            summary: 'Verification failed!',
            detail: err.response?.data.error,
            life: 3000
        });
        return false;
    } finally {
        setLoading(false);
        setOTP();
    }
};
