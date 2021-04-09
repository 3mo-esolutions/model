# Authentication

## Applications without Authentication
MoDeL supports applications without authentication. This would be the case if no **Authenticator** component in registered. This very webpage is a MoDeL-based application without authentication.

## Registering an Authenticator
To Register an authenticator, create a dialog component that inherits from [DialogAuthenticator](../components/DialogAuthenticator). After implementing the abstract members, decorate the component with the `@authenticator` decorator.

> ℹ Create only one authenticator per application. If you create more than one authenticator, the last imported authenticator replaces all the pre-registered ones.