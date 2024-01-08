import { Component, OnInit, ViewChild } from '@angular/core';
import { IProduct } from '../models/product.model';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  
  displayedColumns: string[] = ['productName', 'category', 'date','freshness','price','comment','action'];
  dataSource !: MatTableDataSource<IProduct>;
  @ViewChild(MatPaginator)paginator !:MatPaginator;
  @ViewChild (MatSort)sort !:MatSort;

  constructor(
    private apiService:ApiService,
    private toastr :ToastrService,
    public dialog: MatDialog
    ){}

  ngOnInit(): void {
    this.getAllProducts()
  }

 
  getAllProducts(){
    this.apiService.getProduct().subscribe({
      next :(res)=>{
        this.dataSource = new MatTableDataSource(res)
        this.dataSource.paginator=this.paginator;
        this.dataSource.sort=this.sort;
      } 
      ,
      error:()=>{
        this.toastr.error('Error while feching the records!!')
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onDeleteProduct(id:number){
   this.apiService.deleteProduct(id).subscribe({
    next :(res)=>{
    this.toastr.success('Product deleted successfully.')
    this.getAllProducts()
   },
   error:()=>{
    this.toastr.error('Something went wrong.')
   }
  })
  }

  onEditProduct(row:IProduct){
    const dialogRef=this.dialog.open(DialogComponent,{
      data : row
    }).afterClosed().subscribe(value=>{
      if(value=='Update'){
        this.getAllProducts()
      }
    })
    
  }
}

