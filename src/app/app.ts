import { Component } from '@angular/core';

// Importamos herramientas para formularios reactivos
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';

// Importamos directivas comunes (*ngFor, *ngIf)
import { CommonModule } from '@angular/common';

// Servicio para compartir datos con la tabla
import { ListaService } from './tabla-compras/lista_serve';

// Router para navegar entre páginas
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ],
  styleUrl: './app.css'
})

export class App {

  // Formulario principal
  miFormulario: FormGroup;

  // Variable para saber si estamos editando
  indiceEditando: number | null = null;

  constructor(
    private fb: FormBuilder,
    private listaService: ListaService,
    public router: Router
  ) {

    // Definimos la estructura del formulario
    this.miFormulario = this.fb.group({
      nombreLista: ['', Validators.required],
      items: this.fb.array([]) // Array de productos
    });

  }

  // Getter para acceder fácilmente al FormArray desde el HTML
  get listaItems() {
    return this.miFormulario.get('items') as FormArray;
  }

  // =============================
  // MÉTODO: AGREGAR PRODUCTO
  // =============================
  agregarItem() {

    const nuevoGrupo = this.fb.group({
      producto: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });

    // Agregamos el producto al FormArray
    this.listaItems.push(nuevoGrupo);

  }

  // =============================
  // MÉTODO: ELIMINAR PRODUCTO
  // =============================
  eliminarItem(indice: number) {

    // Eliminamos el item según su posición
    this.listaItems.removeAt(indice);

    console.log('Valores del formulario:', this.listaItems.value);

  }

  // =============================
  // MÉTODO: EDITAR PRODUCTO
  // =============================
  editarItem(indice: number) {

    // Guardamos el índice que se está editando
    this.indiceEditando = indice;

    // Obtenemos el producto seleccionado
    const item = this.listaItems.at(indice);

    // Cargamos sus valores en el formulario
    const producto = item.value.producto;
    const cantidad = item.value.cantidad;

    // Mostramos en consola qué se está editando
    console.log("Editando:", producto, cantidad);

    // Aquí podrías agregar más lógica si quisieras
  }

  // =============================
  // MÉTODO: ENVIAR DATOS
  // =============================
  enviarDatos() {

    console.log('Valores del formulario:', this.miFormulario.value);

  }

  // =============================
  // MÉTODO: IR A LA TABLA
  // =============================
  verEnOtraPagina() {

    // Guardamos los datos en el servicio
    this.listaService.actualizarLista(this.listaItems.value);

    // Navegamos a la página de la tabla
    this.router.navigate(['/lista']);

  }

}