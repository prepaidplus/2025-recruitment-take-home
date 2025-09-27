import { AuthUseCase } from '../usecases/authUseCase';

export function initForgotPasswordPage() {
    const app = window.f7;
    const authUseCase = new AuthUseCase();

    $$('#forgot-password-form').on('submit', async function (e) {
        e.preventDefault();
        
        const formData = app.form.convertToData(this);
        const submitButton = this.querySelector('button[type="submit"]');
        const errorDiv = $$('#reset-error');
        const successDiv = $$('#reset-success');
        
        submitButton.innerHTML = 'Sending...';
        submitButton.disabled = true;
        errorDiv.hide();
        successDiv.hide();
        
        const result = await authUseCase.executePasswordResetRequest(formData.email);
        
        if (result.success) {
            successDiv.text('Password reset link has been sent to your email.').show();
            submitButton.innerHTML = 'Send Reset Link';
            submitButton.disabled = false;
        } else {
            errorDiv.text(result.error).show();
            submitButton.innerHTML = 'Send Reset Link';
            submitButton.disabled = false;
        }
    });
}

export function initResetPasswordPage() {
    const app = window.f7;
    const authUseCase = new AuthUseCase();

    // Get token from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    $$('#reset-token').val(token);

    $$('#reset-password-form').on('submit', async function (e) {
        e.preventDefault();
        
        const formData = app.form.convertToData(this);
        const submitButton = this.querySelector('button[type="submit"]');
        const errorDiv = $$('#reset-password-error');
        const successDiv = $$('#reset-password-success');
        
        submitButton.innerHTML = 'Resetting...';
        submitButton.disabled = true;
        errorDiv.hide();
        successDiv.hide();
        
        const result = await authUseCase.executePasswordReset(
            formData.token, 
            formData.newPassword, 
            formData.confirmPassword
        );
        
        if (result.success) {
            successDiv.text('Password reset successfully! You can now login with your new password.').show();
            setTimeout(() => {
                app.views.main.router.navigate('/login/');
            }, 3000);
        } else {
            errorDiv.text(result.error).show();
            submitButton.innerHTML = 'Reset Password';
            submitButton.disabled = false;
        }
    });
}