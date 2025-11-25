import { AuthenticationService, IAuthenticationService } from "../auth/authenticate.service";
import { UserService, IUserService } from "../users/user.service";

interface IUnitOfWork {
    authenticationService: IAuthenticationService;
    userService: IUserService;
}

class UnitOfWork implements IUnitOfWork {
    private static unitOfWork: IUnitOfWork | null = null;
    public static getUnitOfWork(): IUnitOfWork {
        return (UnitOfWork.unitOfWork = UnitOfWork.unitOfWork ?? new UnitOfWork());
    }

    private _authenticationService: IAuthenticationService | null = null;
    public get authenticationService(): IAuthenticationService {
        return (this._authenticationService =
            this._authenticationService ?? new AuthenticationService());
    }

    private _userService: IUserService | null = null;
    public get userService(): IUserService {
        return (this._userService = this._userService ?? new UserService());
    }
}

export const unitOfWork: IUnitOfWork = UnitOfWork.getUnitOfWork();