import { RouteService } from './../../services/route.service';
import { VehicleService } from './../../services/vehicle.service';
import { AdminService } from './../../services/admin.service';
import { DriverService } from './../../services/driver.service';
import { TravelService } from './../../services/travel.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar';  // Mensaje de alerta
import { Admin } from 'src/app/models/admin';
import { Driver } from 'src/app/models/driver';
import { Vehicle } from 'src/app/models/vehicle';
import { Route } from 'src/app/models/route';

@Component({
  selector: 'app-add-edit-travels',
  templateUrl: './add-edit-travels.component.html',
  styleUrls: ['./add-edit-travels.component.scss']
})
export class AddEditTravelsComponent implements OnInit {

  states = ["Active", "Inactive"]; // Radio button options
  myForm!: FormGroup; // Received data of the form (angular reactive form)
  actionBtn: string = "Agregar"; // Save or Update

  listAdmins!:Admin[]
  adminSelected!: number

  listDrivers!:Driver[]
  driverSelected!: number

  listVehicles!:Vehicle[]
  vehicleSelected!: number

  listRoutes!:Route[]
  routeSelected!: number

  saveAdmin!: Admin
  saveDriver!: Driver
  saveVehicle!: Vehicle
  saveRoute!: Route

  constructor(
    private formBuilder: FormBuilder,
    private service: TravelService,
    private dialogRef: MatDialogRef<AddEditTravelsComponent>,
    private snackBar: MatSnackBar,
    private apiAdmin: AdminService,
    private apiDriver: DriverService,
    private apiVehicle: VehicleService,
    private apiRoute: RouteService,
    @Inject(MAT_DIALOG_DATA) public editData : any) { }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      id: [''],
      adminSelected: [''],
      driverSelected: [''],
      vehicleSelected: [''],
      routeSelected: [''],
      dateOfStart: ['', Validators.required],
      dateOfEnd: ['', Validators.required],
      duration: ['', Validators.required],
      state: ['', Validators.required]
    });

    if (this.editData) {
      this.actionBtn = "Actualizar";
      this.myForm.controls['dateOfStart'].setValue(this.editData.dateOfStart);
      this.myForm.controls['dateOfEnd'].setValue(this.editData.dateOfEnd);
      this.myForm.controls['duration'].setValue(this.editData.duration);
      this.myForm.controls['state'].setValue(this.editData.state);
      this.myForm.controls['adminSelected'].setValue(this.editData.saveAdmin);
      this.myForm.controls['driverSelected'].setValue(this.editData.saveDriver);
      this.myForm.controls['vehicleSelected'].setValue(this.editData.saveVehicle);
      this.myForm.controls['routeSelected'].setValue(this.editData.saveRoute);
    }
    this.cargarAdmins();
    this.cargarDrivers();
    this.cargarRoutes();
    this.cargarVehicles();
  }

  JSONvalores(){

    var idAdmin = {id: this.adminSelected}
    var jsonAdmin = JSON.stringify(idAdmin)
    console.log("JSON admin",jsonAdmin)
    this.saveAdmin = JSON.parse(jsonAdmin)
    console.log("Objeto",this.saveAdmin)

    var idDriver = {id: this.driverSelected}
    var jsonDriver = JSON.stringify(idDriver)
    console.log("JSON driver",jsonDriver)
    this.saveDriver = JSON.parse(jsonDriver)
    console.log("Objeto",this.saveDriver)

    var idVehicle = {id: this.vehicleSelected}
    var jsonVehicle = JSON.stringify(idVehicle)
    console.log("JSON vehicle",jsonVehicle)
    this.saveVehicle = JSON.parse(jsonVehicle)
    console.log("Objeto",this.saveVehicle)

    var idRoute = {id: this.routeSelected}
    var jsonRoute = JSON.stringify(idRoute)
    console.log("JSON route",jsonRoute)
    this.saveRoute = JSON.parse(jsonRoute)
    console.log("Objeto",this.saveRoute)
    
  }
  cargarAdmins(){
    this.apiAdmin.get().subscribe(data => {
      this.listAdmins = data
      console.log("Admins cargados",this.listAdmins)
    })
  }
  cargarRoutes(){
    this.apiRoute.get().subscribe(data => {
      this.listRoutes = data
      console.log("Rutas cargados",this.listRoutes)
    })
  }

  cargarVehicles(){
    this.apiVehicle.get().subscribe(data => {
      this.listVehicles = data
      console.log("Vehiculos cargados",this.listVehicles)
    })
  }

  cargarDrivers(){
    this.apiDriver.get().subscribe(data => {
      this.listDrivers = data
      console.log("Conductores cargados",this.listDrivers)
    })
  }
  addProduct(): void {
    if (!this.editData) { // Si no se ha recibido informacion para editar
      if (this.myForm.valid) { // Save
        this.service.add(this.myForm.value).subscribe({
          next: (data) => {
            this.snackBar.open("Travel was added successfully", "Ok", { duration: 3000 });
            this.myForm.reset();
            this.dialogRef.close('agregar');
          },
          error: () => {
            this.snackBar.open("An error occurred while adding the travel", "Ok", { duration: 3000 });
          }
        });
      }
    }
    else {
      this.updateProduct();
    }
  }
  updateProduct() {
    this.service.update(this.myForm.value, this.editData.id).subscribe({
      next: (data) => {
        this.snackBar.open("The ID Travel" + this.editData.id + " was updated successfully", "Ok", { duration: 3000 });
        this.myForm.reset();
        this.dialogRef.close('actualizar');
      },
      error: (varError) => {
        this.snackBar.open("An error occurred while updating the ID Travel" + this.editData.id, "Ok", { duration: 3000 });
      }
    });
  }
}