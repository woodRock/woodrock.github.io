import SignUpPage from '../components/SignUp';
import SignInPage from '../components/SignIn';
import PasswordForgetPage from '../components/PasswordForget';
import HomePage from '../components/Home';
import AccountPage from '../components/Account';
import ProjectsPage from '../components/Projects';
import BlogPage from '../components/Blog';
import EducationPage from '../components/Education';
import JobPage from '../components/Job';
import SkillsPage from '../components/Skills';
import CVPage from '../components/CV';

const ROUTES = [
    {
      path: '/home',
      component: HomePage,
      icon: 'home', // material-icons class name
    },
    {
      path: '/projects',
      component: ProjectsPage,
      icon: 'code',
    },
    {
      path: '/skills',
      component: SkillsPage,
      icon: 'language',
    },
    {
      path: '/education',
      component: EducationPage,
      icon: 'school',
    },
    {
      path: '/job',
      component: JobPage,
      icon: 'work'
    },
    {
      path: '/cv',
      component: CVPage,
      icon: '',
    },
    {
      path: '/blog',
      component: BlogPage,
      icon: 'create',
    },
    {
      path: '/account',
      component: AccountPage,
      icon: 'settings',
      auth: true,
    },
    {
      path: '/signup',
      component: SignUpPage,
      icon: '',
    },
    {
      path: '/signin',
      component: SignInPage,
      icon: '',
    },
    {
      path: '/pw-forget',
      component: PasswordForgetPage,
      icon: '',
    },
];

export default ROUTES;
