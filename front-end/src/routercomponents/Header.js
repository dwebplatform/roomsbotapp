import { NavigationComponent } from '../components/NavigationComponent';
import { AspireComponent } from '../components/AspireComponent';

export const Header = () => {
    return (<div className="header" >
        <AspireComponent />
        <NavigationComponent />
    </div>)
}