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
import LandingPage from '../components/Landing';

const ROUTES = [
    {
      path: '',
      component: LandingPage,
    },
    {
      name: 'Home',
      path: '/home',
      component: HomePage,
      icon: 'home', // material-icons class name
    },
    {
      name: 'Projects',
      path: '/projects',
      component: ProjectsPage,
      icon: 'code',
    },
    {
      name: 'Skills',
      path: '/skills',
      component: SkillsPage,
      icon: 'language',
    },
    {
      name: 'Education',
      path: '/education',
      component: EducationPage,
      icon: 'school',
    },
    {
      name: 'Jobs',
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
      name: 'Blog',
      path: '/blog',
      component: BlogPage,
      icon: 'create',
    },
    {
      name: 'Account',
      path: '/account',
      component: AccountPage,
      icon: 'settings',
      auth: true,
    },
    {
      name: 'Register',
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
