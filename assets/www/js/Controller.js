
function Controller() {

	var $this = this;
	
	var mode = 'free';
	//var mode = 'pro';
	

	this.test = function() {

		// some test code here
		console.log('Running test method');

		navigator.notification.alert('You are the winner test!', // message
		false, // callback
		'Game Over', // title
		'Done' // buttonName
		);

	};

	this.message = function( type, message ){
		
		alert( message );
		
	};

	this.infoBox = function( title, message ){
		
		// disabling this for now, thinking native might be better
		
		alert( message );
		
		return;
		
		$('.message .title').html( title );
		$('.message .body').html( message );
		
		$('.message').show();
		$('#overlay').show();
		
	};
	
	this.initHacks = function(){
		
		//$('.mortgageCalculator input').attr('autocomplete','off');
	};
	
	this.init = function() {

		$this.initHacks();
		
		if( !$this.checkNetworkConnection() ){
			$this.message( 'error', 'No internet connection!' );
		}	
				
		$('.message .closeMessage').on('click',function(){
			
			$(this).parents('.message').hide();			
			$('#overlay').hide();
			
			return false;
		});
		
		$('.calculate').on('click',function(){
			
			console.log('running calculator');
			
			$this.calculate(  );
			
			return false;
		});
		
		$('.modeSwitch').on('click',function(){
			
			console.log('Switched to advance mode');
			
			if( $(this).attr('id') == 'advancedModeButton'  ){
				
				// switch to advance
				$('.advancedMode').show();
				$('#basicModeButton').css('display', 'inline-block');
				$(this).hide();
				
			}else{
				
				// switch to basic - plus clear the fields
				$('.advancedMode').hide();
				$('.advancedMode input').val('');
				$('#advancedModeButton').css('display', 'inline-block');
				$(this).hide();
				
			}
			
			
			return false;
		});
				
		// add the validators
		$FormValidator = new FormValidation();
		$FormValidator.bindHandlers();
		
	};
	
	
	this.calculate = function(  ){
		
		formdata = $('.mortgageCalculator form').serialize();		

		// check the min fields are done
		// mortgage amount
		if( !is_numeric( $('.mortgageCalculator form input[name="mortgage_amount"]').val() ) ){			
			$this.infoBox('Error', 'Please select a valid mortgage amount');
			return false;			
		}
		// first interest rate
		if( !is_numeric( $('.mortgageCalculator form input[name="interestrate_1"]').val() ) 
				|| parseInt( $('.mortgageCalculator form input[name="interestrate_1"]').val() ) > 30
				|| parseInt( $('.mortgageCalculator form input[name="interestrate_1"]').val() ) == 0){			
			$this.infoBox('Error', 'Please select a valid interest rate less that 30%');
			return false;			
		}
		// number of years
		if( !is_numeric( $('.mortgageCalculator form input[name="interestrate_period_1"]').val() ) 
				|| parseInt( $('.mortgageCalculator form input[name="interestrate_period_1"]').val() ) <= 0 ){			
			$this.infoBox('Error', 'Please enter number of years the mortgage lasts');
			return false;			
		}
		
		$this.showLoader();
		
		// get device data from phone gap
		try{
			devicedata = '&device_name=' + device.name + '&	device_phonegap=' + device.phonegap + '&device_platform=' + device.platform + '&device_uuid=' + device.uuid + '&device_version=' + device.version ;
		}catch(err){
			devicedata = ''
		}
		
		
		
		$.ajax({
			  url: 'http://www.mortgagecostcalculator.co.uk/index/mobileapp',
			  dataType: 'json',
			  data: formdata + devicedata,
			  success: function( data ){
				  $this.handleCalculateSuccess(data);
			  },
			  error: function(){
				  $this.hideLoader();
				  $this.message( 'error', 'No internet connection!' );
			  }
			});
		
	};
	
	this.handleCalculateSuccess = function( data ){
		
		$('#monthly_payment_1').html( $this.moneyFormat( data.monthly_payment_1 ) );
		
		if(  data.monthly_payment_2 != false ){
			$('#monthly_payment_2').html( $this.moneyFormat( data.monthly_payment_2 ) );
			hidePayment2 = false;
		}else{
			$('#monthly_payment_2').html( 'n/a' );
			hidePayment2 = true;
		}
		
		$('#total_repay').html( $this.moneyFormat( data.total_repay, 0 ) );
		$('#total_interest').html( $this.moneyFormat( data.total_interest, 0 ) );
		$('#cost_per_pound').html( $this.moneyFormat( data.cost_per_pound ) );
		$('#completion').html( data.completion );
		
		$('#mortgageCalculatorResults').show();
		
		if( hidePayment2 ){
			// remove this from view
			$('#monthly_payment_2').parent().hide();
		}else{
			// make sure its in view
			$('#monthly_payment_2').parent().show();
		}
		
		$this.hideLoader();
		
		//scroll to this part
		$('html, body').animate({scrollTop: $("#mortgageCalculatorResults").offset().top}, 1000);

	};
	
	this.moneyFormat = function( value, dec ){
		
		if( dec == null ){
			dec = 2
		}
		
		return '&pound;' + number_format ( value, dec, '.', ',');
		
	};
	
	this.showLoader = function(){
		$('.preloader').show();		
	};
	
	this.hideLoader = function(){
		$('.preloader').hide();
	};
	
	
	this.checkNetworkConnection = function (){
		
		if (typeof navigator.network != 'undefined'){
						
	        var networkState = navigator.network.connection.type;

	        var states = {};
	        states[Connection.UNKNOWN]  = 'Unknown connection';
	        states[Connection.ETHERNET] = 'Ethernet connection';
	        states[Connection.WIFI]     = 'WiFi connection';
	        states[Connection.CELL_2G]  = 'Cell 2G connection';
	        states[Connection.CELL_3G]  = 'Cell 3G connection';
	        states[Connection.CELL_4G]  = 'Cell 4G connection';
	        states[Connection.NONE]     = 'No network connection';

	        console.log('Connection type: ' + states[networkState]);
	        console.log('Connection value returned: ' + networkState);

	        if( networkState == null || networkState == Connection.NONE ){        	
	        	  return false;
	        }else{        	
	        	return true;
	        }   
			
	        
		}else{
			
			return true;
		}
		
           
		
		
	}


};


function FormValidation(){
	
	$this = this;
	
	this.bindHandlers = function(){
		
		console.log('binding validators');
		
		$('.validateCurrency').on( 'focus', function(){
						
			console.log('focus currency');
			
			if( $(this).hasClass('formatted') ){
				
				// hide it and show the other
				$(this).hide();
				$(this).siblings('.raw').show().focus();
				
			}
			
		});	
		
		$('.validateCurrency').on( 'blur', function(){
			
			if( $(this).hasClass('raw') ){
				
				$(this).hide();				
				//cp across - dp formatting here
				value = $(this).val();
				value = number_format ( value, 0, '.', ',');
				valueForCheck = number_format ( value, 0, '.', '');
				// only update if there is something
				
				if( valueForCheck >= 0 ){
					value = htmlDecode('&pound; ' + value);					
					$(this).siblings('.formatted').val(value);
				}
				$(this).siblings('.formatted').show();
			}
			
		});
		
		$('.validatePercentage').on( 'focus', function(){
			
			console.log('focus currency');
			
			if( $(this).hasClass('formatted') ){
				
				// hide it and show the other
				$(this).hide();
				$(this).siblings('.raw').show().focus();
				
			}
			
		});	
		
		$('.validatePercentage').on( 'blur', function(){
			
			if( $(this).hasClass('raw') ){
				
				$(this).hide();				
				//cp across - dp formatting here
				value = $(this).val();
				value = number_format ( value, 2, '.', ',');
				// only update if there is something
				if( value > 0 ){
					value = htmlDecode('' + value + ' %');
					$(this).siblings('.formatted').val(value);
				}					
				$(this).siblings('.formatted').show();
			}
			
		});
		
	};
	
}