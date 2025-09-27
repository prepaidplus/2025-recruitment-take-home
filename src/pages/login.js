import { AuthUseCase } from '../usecases/authUseCase';

export function initLoginPage() {
    const app = window.f7;
    const authUseCase = new AuthUseCase();

    $$('#login-form').on('submit', async function (e) {
        e.preventDefault();
        
        const formData = app.form.convertToData(this);
        const submitButton = this.querySelector('button[type="submit"]');
        const errorDiv = $$('#login-error');
        
        // Show loading state
        submitButton.innerHTML = 'Logging in...';
        submitButton.disabled = true;
        errorDiv.hide();
        
        const result = await authUseCase.executeLogin(formData.email, formData.password);
        
        if (result.success) {
            app.dialog.alert('Login successful!', 'Success', () => {
                app.views.main.router.navigate('/dashboard/');
            });
        } else {
            errorDiv.text(result.error).show();
            submitButton.innerHTML = 'Login';
            submitButton.disabled = false;
        }
    });
}