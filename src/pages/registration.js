import { AuthUseCase } from '../usecases/authUseCase';

export function initRegisterPage() {
    const app = window.f7;
    const authUseCase = new AuthUseCase();

    $$('#register-form').on('submit', async function (e) {
        e.preventDefault();
        
        const formData = app.form.convertToData(this);
        const submitButton = this.querySelector('button[type="submit"]');
        const errorDiv = $$('#register-error');
        const successDiv = $$('#register-success');
        
        // Show loading state
        submitButton.innerHTML = 'Registering...';
        submitButton.disabled = true;
        errorDiv.hide();
        successDiv.hide();
        
        const result = await authUseCase.executeRegistration(formData);
        
        if (result.success) {
            successDiv.text('Merchant registered successfully! An admin will activate the account.').show();
            this.reset();
            submitButton.innerHTML = 'Register Merchant';
            submitButton.disabled = false;
        } else {
            errorDiv.text(result.error).show();
            submitButton.innerHTML = 'Register Merchant';
            submitButton.disabled = false;
        }
    });
}