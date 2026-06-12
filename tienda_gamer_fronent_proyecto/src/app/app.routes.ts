import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { CatalogoComponent } from './pages/catalogo/catalogo';
import { ProductoDetalleComponent } from './pages/producto-detalle/producto-detalle';
import { CarritoComponent } from './pages/carrito/carrito';
import { LoginComponent } from './pages/login/login';
import { RegistroComponent } from './pages/registro/registro';
import { CompraExitoComponent } from './pages/compra-exito/compra-exito';
import { AdminComprasComponent } from './pages/admin-compras/admin-compras';
import { AuditoriaComponent } from './pages/auditoria/auditoria';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard';
import { AdminCategoriasComponent } from './pages/admin-categorias/admin-categorias';
import { AdminClientesComponent } from './pages/admin-clientes/admin-clientes';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'producto/:id', component: ProductoDetalleComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'compra-exito/:id', component: CompraExitoComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'admin/compras', component: AdminComprasComponent, canActivate: [adminGuard] },
  { path: 'admin/auditoria', component: AuditoriaComponent, canActivate: [adminGuard] },
  { path: 'admin/categorias', component: AdminCategoriasComponent, canActivate: [adminGuard] },
  { path: 'admin/clientes', component: AdminClientesComponent, canActivate: [adminGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];