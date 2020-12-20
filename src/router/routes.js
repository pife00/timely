
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '', component: () => import('pages/Home.vue') },
      {path:'/registers',component:()=> import('pages/Registers.vue')},
      {path:'/editmobile/:id', name:"editMobile", component:()=> import('pages/EditMobile.vue')},
      {path:'/board',name:'board',component:()=> import('pages/Board')},
      {path:'/users',name:'users',component:()=> import('pages/Users')},
      {path:'/users/:id',name:"userById",component:()=>import('pages/UserById')}
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
