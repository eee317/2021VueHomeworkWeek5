const apiUrl='https://vue3-course-api.hexschool.io'
const api_path='peiying'
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;
defineRule('required', required);
defineRule('email', email);
defineRule('min', min); //限制最小的值，例如：3碼
defineRule('max', max); //限制最大的值
loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');
configure({
    generateMessage: localize('zh_TW'),
      validateOnInput: true, // 調整為輸入字元立即進行驗證
});

const app=Vue.createApp({
    components: {
        VForm: Form,
        VField: Field,
        ErrorMessage: ErrorMessage,
    },
    data(){
        return {
            products:[],
            productId:'',
            cartData:{},
            isLoadingItem:'',
            cart:{
                carts:[]
            },
            userData:{
                user:{
                    email:'',
                    name:'',
                    tel:'',
                    address:''
                },
                message:''
            }
        }
    },
    methods: {
        getProducts(){
            const url=`${apiUrl}/v2/api/${api_path}/products/all`;
            axios.get(url)
            .then(res=>{
                console.log(res)
                this.products=res.data.products
            })
            .catch(err=>{
                console.log(err)
            })
        },
        addToCart(product, qty=1){
            this.isLoadingItem=product.id
            const url=`${apiUrl}/v2/api/${api_path}/cart`;
            const data={
                product_id:product.id,
                qty
            }
            console.log(data)
            axios.post(url,{data})
            .then(res=>{
                alert(`『 ${product.title} 』已加入購物車`);
                this.renderCart();
                this.$refs.productModal.closeModal();
                this.isLoadingItem='';
            })
            .catch(err=>{
                console.log(err)
            })
        },
        deleteACart(id){
            const url=`${apiUrl}/v2/api/${api_path}/cart/${id}`;
            axios.delete(url)
            .then(res=>{
                console.log(res)
                this.renderCart()
            })
            .catch(err=>{
                console.log(err)
            })
        },
        deleteAllCart(){
            const url=`${apiUrl}/v2/api/${api_path}/carts`;
            axios.delete(url)
            .then(res=>{
                console.log(res);
                this.renderCart();
            })
            .catch(err=>{
                console.log(err)
            })

        },
        renderCart(){
            const url=`${apiUrl}/v2/api/${api_path}/cart`;
            axios.get(url)
            .then(res=>{
                this.cartData=res.data.data
                console.log(this.cartData)
                if(this.cartData.carts.length===0){
                    this.cart={
                        carts:[]
                    }
                }else{
                    this.cart={
                        carts:[1]
                    }
                }
            })
            .catch(err=>{
                console.log(err)
            })
        },
        putCartNum(cart){
            this.isLoadingItem=cart.id
            const url=`${apiUrl}/v2/api/${api_path}/cart/${cart.id}`;
            const data={
                product_id:cart.id,
                qty:cart.qty
            };
            axios.put(url,{data})
            .then(res=>{
                this.isLoadingItem='';
                this.renderCart();
            })
            .catch(err=>{
                console.dir(err);
            })
            
        },
        openProductModal(id){
            this.$refs.productModal.openModal();
            this.productId=id;
        },
        postOrder(){
            const url=`${apiUrl}/v2/api/${api_path}/order`
            axios.post(url,{data:this.userData})
            .then(res=>{
                console.log(res)
                this.$refs.form.resetForm();
                this.renderCart();
            })
            .catch(err=>{
                console.log(err)
            })
        }
    },
    mounted(){
        this.getProducts();
        this.renderCart();
    }
});
app.component('product-modal',{
    template:'#userProductModal',
    props:['id','is-loading-item'],
    data(){
        return{
            modal:{},
            product:{},
            qty:1
        }
    },
    watch:{
        id(){
            this.getProduct();
        }
    },
    methods: {
        openModal(){
            this.modal.show();
        },
        closeModal(){
            this.modal.hide();
            this.qty=1;
        },
        getProduct(){
            const url=`${apiUrl}/v2/api/${api_path}/product/${this.id}`;
            axios.get(url)
            .then(res=>{
                console.log(res);
                this.product=res.data.product;
            })
            .catch(err=>{
                console.log(err);
            })
        },
        addToCart(){
            this.$emit('add-cart',this.product, this.qty)
        }
    },
    mounted(){
        this.modal=new bootstrap.Modal(this.$refs.modal);
    }

})

app.mount('#app')