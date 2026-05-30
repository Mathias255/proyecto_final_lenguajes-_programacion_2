import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { CatalogoComponent } from './pages/catalogo/catalogo';
import { ProductoDetalleComponent } from './pages/producto-detalle/producto-detalle';
import { CarritoComponent } from './pages/carrito/carrito';
import { LoginComponent } from './pages/login/login';
import { RegistroComponent } from './pages/registro/registro';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'producto/:id', component: ProductoDetalleComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];