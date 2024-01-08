import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { IProduct } from '../models/product.model';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit{
  freshnessList =['Brand New','Second Hand','Refurbished'];
  productForm !:FormGroup;
  actionButton :string ='Save'

  constructor(
    private fb:FormBuilder,
    private apiService:ApiService,
    private toastr :ToastrService,
    private dialogRef : MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA)public editData : IProduct
    ){}

  ngOnInit(): void {
    this.productForm=this.fb.group({
      productName :['',Validators.required],
      category :['',Validators.required],
      freshness :['',Validators.required],
      price :['',Validators.required],
      comment :['',Validators.required],
      date :['',Validators.required],
    })
    if(this.editData){
      this.actionButton='Update'
      this.productForm.controls['productName'].setValue(this.editData.productName)
      this.productForm.controls['category'].setValue(this.editData.category)
      this.productForm.controls['price'].setValue(this.editData.price)
      this.productForm.controls['freshness'].setValue(this.editData.freshness)
      this.productForm.controls['comment'].setValue(this.editData.comment)
      this.productForm.controls['date'].setValue(this.editData.date)
    }
  }

  onSaveProduct(){
    const newProduct=this.productForm.value;
    if(!this.editData){
    if(this.productForm.valid){
      this.apiService.postProduct(newProduct).subscribe({
        next:(product)=>{
        this.toastr.success('product added successfully.')
        this.productForm.reset();
        this.dialogRef.close('Save');
      },
       error:()=>{
        this.toastr.error('something went wrong!!')
       }
    })
    }
  }else{
    this.updateProduct()
  }

  }

  updateProduct(){
    this.apiService.updateProduct(this.productForm.value,this.editData.id).subscribe({
      next :(res)=>{
        this.toastr.success('Product updated successfully.')
        
        this.productForm.reset()
        this.dialogRef.close('Update')
      },
      error:()=>{
        this.toastr.error('Something went wrong.')   
      }
    })
  }
}
